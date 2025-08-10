package main

import (
	"bytes"
	"fmt"
	"html/template"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
	"sort"
	"strings"
	"time"

	"github.com/yuin/goldmark"
	"github.com/yuin/goldmark/extension"
	"github.com/yuin/goldmark/parser"
	"github.com/yuin/goldmark/renderer/html"
)

// Структуры данных
type Article struct {
	Title    string
	Date     time.Time
	DateStr  string
	Content  template.HTML
	Filename string
	URL      string
}

type PageData struct {
	Title      string
	Articles   []Article
	Content    template.HTML
	IsNote     bool
	CurrentURL string
}

// Глобальные переменные
var (
	md goldmark.Markdown
)

// Инициализация
func init() {
	// Настройка Goldmark для парсинга Markdown
	md = goldmark.New(
		goldmark.WithExtensions(
			extension.GFM,           // GitHub Flavored Markdown
			extension.Table,         // Таблицы
			extension.Strikethrough, // Зачеркивание
			extension.Linkify,       // Автоматические ссылки
			extension.TaskList,      // Списки задач
		),
		goldmark.WithParserOptions(
			parser.WithAutoHeadingID(), // Автоматические ID для заголовков
		),
		goldmark.WithRendererOptions(
			html.WithHardWraps(), // Переносы строк как <br>
			html.WithXHTML(),     // XHTML совместимость
			html.WithUnsafe(),    // Разрешить HTML теги
		),
	)
}

// Парсинг Markdown с использованием Goldmark
func parseMarkdown(content []byte) template.HTML {
	var buf bytes.Buffer
	if err := md.Convert(content, &buf); err != nil {
		log.Printf("Ошибка конвертации Markdown: %v", err)
		return template.HTML("<p>Ошибка обработки контента</p>")
	}
	return template.HTML(buf.String())
}

// Парсинг имени файла для извлечения даты и заголовка
func parseFilename(filename string) (time.Time, string, error) {
	// Регулярное выражение для формата: ДД.ММ.ГГГГ-Название.md
	re := regexp.MustCompile(`(\d{2}\.\d{2}\.\d{4})-(.+)\.md$`)
	matches := re.FindStringSubmatch(filename)

	if len(matches) != 3 {
		return time.Time{}, "", fmt.Errorf("неверный формат имени файла: %s", filename)
	}

	dateStr := matches[1]
	title := matches[2]

	date, err := time.Parse("02.01.2006", dateStr)
	if err != nil {
		return time.Time{}, "", fmt.Errorf("ошибка парсинга даты: %v", err)
	}

	return date, title, nil
}

// Получение списка статей из директории
func getArticles(dir string) ([]Article, error) {
	var articles []Article

	if _, err := os.Stat(dir); os.IsNotExist(err) {
		return articles, nil
	}

	files, err := ioutil.ReadDir(dir)
	if err != nil {
		return nil, err
	}

	for _, file := range files {
		if !strings.HasSuffix(file.Name(), ".md") {
			continue
		}

		date, title, err := parseFilename(file.Name())
		if err != nil {
			log.Printf("Пропускаем файл %s: %v", file.Name(), err)
			continue
		}

		content, err := ioutil.ReadFile(filepath.Join(dir, file.Name()))
		if err != nil {
			log.Printf("Ошибка чтения файла %s: %v", file.Name(), err)
			continue
		}

		htmlContent := parseMarkdown(content)

		article := Article{
			Title:    title,
			Date:     date,
			DateStr:  date.Format("02.01.2006"),
			Content:  htmlContent,
			Filename: file.Name(),
			URL:      strings.TrimSuffix(file.Name(), ".md"),
		}

		articles = append(articles, article)
	}

	// Сортировка по дате (новые сначала)
	sort.Slice(articles, func(i, j int) bool {
		return articles[i].Date.After(articles[j].Date)
	})

	return articles, nil
}

// Загрузка и парсинг шаблона
func parseTemplate(filename string) (*template.Template, error) {
	// Функции для шаблонов
	funcMap := template.FuncMap{
		"eq":  func(a, b interface{}) bool { return a == b },
		"ne":  func(a, b interface{}) bool { return a != b },
		"gt":  func(a, b int) bool { return a > b },
		"lt":  func(a, b int) bool { return a < b },
		"and": func(a, b bool) bool { return a && b },
		"len": func(slice []Article) int { return len(slice) },
		"add": func(a, b int) int { return a + b },
		"mul": func(a, b int) int { return a * b },
	}

	return template.New(filepath.Base(filename)).Funcs(funcMap).ParseFiles(filename)
}

// Обработчики HTTP запросов

// Главная страница
func homeHandler(w http.ResponseWriter, r *http.Request) {

	if r.URL.Path != "/" {
		notFoundHandler(w, r)
		return
	}

	tmpl, err := parseTemplate("templates/home.html")
	if err != nil {
		log.Printf("Ошибка загрузки шаблона home.html: %v", err)
		http.Error(w, "Ошибка загрузки шаблона", http.StatusInternalServerError)
		return
	}

	data := PageData{
		Title:      "Главная",
		CurrentURL: r.URL.String(),
	}

	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	if err := tmpl.Execute(w, data); err != nil {
		log.Printf("Ошибка рендеринга шаблона home.html: %v", err)
		http.Error(w, "Внутренняя ошибка сервера", http.StatusInternalServerError)
	}
}

// Страница резюме
func resumeHandler(w http.ResponseWriter, r *http.Request) {

	tmpl, err := parseTemplate("templates/page.html")
	if err != nil {
		log.Printf("Ошибка загрузки шаблона page.html: %v", err)
		http.Error(w, "Ошибка загрузки шаблона", http.StatusInternalServerError)
		return
	}

	content, err := ioutil.ReadFile("content/resume.md")
	var htmlContent template.HTML

	if err != nil {
		htmlContent = template.HTML("<p>Резюме не найдено. Создайте файл content/resume.md</p>")
	} else {
		htmlContent = parseMarkdown(content)
	}

	data := PageData{
		Title:      "Резюме",
		Content:    htmlContent,
		CurrentURL: r.URL.String(),
	}

	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	if err := tmpl.Execute(w, data); err != nil {
		log.Printf("Ошибка рендеринга шаблона page.html: %v", err)
		http.Error(w, "Внутренняя ошибка сервера", http.StatusInternalServerError)
	}
}

// Страница хобби
func hobbyHandler(w http.ResponseWriter, r *http.Request) {

	tmpl, err := parseTemplate("templates/page.html")
	if err != nil {
		log.Printf("Ошибка загрузки шаблона page.html: %v", err)
		http.Error(w, "Ошибка загрузки шаблона", http.StatusInternalServerError)
		return
	}

	content, err := ioutil.ReadFile("content/hobby.md")
	var htmlContent template.HTML

	if err != nil {
		htmlContent = template.HTML("<p>Информация о хобби не найдена. Создайте файл content/hobby.md</p>")
	} else {
		htmlContent = parseMarkdown(content)
	}

	data := PageData{
		Title:      "Хобби",
		Content:    htmlContent,
		CurrentURL: r.URL.String(),
	}

	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	if err := tmpl.Execute(w, data); err != nil {
		log.Printf("Ошибка рендеринга шаблона page.html: %v", err)
		http.Error(w, "Внутренняя ошибка сервера", http.StatusInternalServerError)
	}
}

// Страница проекты
func projectsHandler(w http.ResponseWriter, r *http.Request) {

	tmpl, err := parseTemplate("templates/page.html")
	if err != nil {
		log.Printf("Ошибка загрузки шаблона page.html: %v", err)
		http.Error(w, "Ошибка загрузки шаблона", http.StatusInternalServerError)
		return
	}

	content, err := ioutil.ReadFile("content/projects.md")
	var htmlContent template.HTML

	if err != nil {
		htmlContent = template.HTML("<p>Информация о проектах не найдена. Создайте файл content/projects.md</p>")
	} else {
		htmlContent = parseMarkdown(content)
	}

	data := PageData{
		Title:      "Мои Проекты",
		Content:    htmlContent,
		CurrentURL: r.URL.String(),
	}

	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	if err := tmpl.Execute(w, data); err != nil {
		log.Printf("Ошибка рендеринга шаблона page.html: %v", err)
		http.Error(w, "Внутренняя ошибка сервера", http.StatusInternalServerError)
	}
}

// Страница списка заметок
func notesHandler(w http.ResponseWriter, r *http.Request) {

	tmpl, err := parseTemplate("templates/articles.html")
	if err != nil {
		log.Printf("Ошибка загрузки шаблона articles.html: %v", err)
		http.Error(w, "Ошибка загрузки шаблона", http.StatusInternalServerError)
		return
	}

	articles, err := getArticles("content/notes")
	if err != nil {
		log.Printf("Ошибка получения заметок: %v", err)
		http.Error(w, "Ошибка загрузки заметок", http.StatusInternalServerError)
		return
	}

	data := PageData{
		Title:      "Заметки",
		Articles:   articles,
		CurrentURL: r.URL.String(),
	}

	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	if err := tmpl.Execute(w, data); err != nil {
		log.Printf("Ошибка рендеринга шаблона articles.html: %v", err)
		http.Error(w, "Внутренняя ошибка сервера", http.StatusInternalServerError)
	}
}

// Страница отдельной заметки
func noteHandler(w http.ResponseWriter, r *http.Request) {

	tmpl, err := parseTemplate("templates/article.html")
	if err != nil {
		log.Printf("Ошибка загрузки шаблона article.html: %v", err)
		http.Error(w, "Ошибка загрузки шаблона", http.StatusInternalServerError)
		return
	}

	url := strings.TrimPrefix(r.URL.Path, "/notes/")
	if url == "" {
		http.NotFound(w, r)
		return
	}

	filename := url + ".md"
	content, err := ioutil.ReadFile(filepath.Join("content/notes", filename))
	if err != nil {
		http.NotFound(w, r)
		return
	}

	date, title, err := parseFilename(filename)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	htmlContent := parseMarkdown(content)

	data := PageData{
		Title:   title,
		Content: htmlContent,
		Articles: []Article{{
			Title:   title,
			Date:    date,
			DateStr: date.Format("02.01.2006"),
		}},
		IsNote:     true,
		CurrentURL: r.URL.String(),
	}

	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	if err := tmpl.Execute(w, data); err != nil {
		log.Printf("Ошибка рендеринга шаблона article.html: %v", err)
		http.Error(w, "Внутренняя ошибка сервера", http.StatusInternalServerError)
	}
}

// Страница списка статей
func articlesHandler(w http.ResponseWriter, r *http.Request) {

	tmpl, err := parseTemplate("templates/articles.html")
	if err != nil {
		log.Printf("Ошибка загрузки шаблона articles.html: %v", err)
		http.Error(w, "Ошибка загрузки шаблона", http.StatusInternalServerError)
		return
	}

	articles, err := getArticles("content/articles")
	if err != nil {
		log.Printf("Ошибка получения статей: %v", err)
		http.Error(w, "Ошибка загрузки статей", http.StatusInternalServerError)
		return
	}

	data := PageData{
		Title:      "Статьи",
		Articles:   articles,
		CurrentURL: r.URL.String(),
	}

	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	if err := tmpl.Execute(w, data); err != nil {
		log.Printf("Ошибка рендеринга шаблона articles.html: %v", err)
		http.Error(w, "Внутренняя ошибка сервера", http.StatusInternalServerError)
	}
}

// Страница отдельной статьи
func articleHandler(w http.ResponseWriter, r *http.Request) {

	tmpl, err := parseTemplate("templates/article.html")
	if err != nil {
		log.Printf("Ошибка загрузки шаблона article.html: %v", err)
		http.Error(w, "Ошибка загрузки шаблона", http.StatusInternalServerError)
		return
	}

	url := strings.TrimPrefix(r.URL.Path, "/articles/")
	if url == "" {
		http.NotFound(w, r)
		return
	}

	filename := url + ".md"
	content, err := ioutil.ReadFile(filepath.Join("content/articles", filename))
	if err != nil {
		http.NotFound(w, r)
		return
	}

	date, title, err := parseFilename(filename)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	htmlContent := parseMarkdown(content)

	data := PageData{
		Title:   title,
		Content: htmlContent,
		Articles: []Article{{
			Title:   title,
			Date:    date,
			DateStr: date.Format("02.01.2006"),
		}},
		IsNote:     false,
		CurrentURL: r.URL.String(),
	}

	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	if err := tmpl.Execute(w, data); err != nil {
		log.Printf("Ошибка рендеринга шаблона article.html: %v", err)
		http.Error(w, "Внутренняя ошибка сервера", http.StatusInternalServerError)
	}
}

// robotsHandler обработчик для robots.txt
func robotsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/plain")
	fmt.Fprintf(w, `User-agent: *
Allow: /

Sitemap: http://%s/sitemap.xml`, r.Host)
}

// sitemapHandler обработчик для sitemap.xml
func sitemapHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/xml")

	sitemap := `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>http://%s/</loc>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>http://%s/resume</loc>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>http://%s/articles</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>http://%s/notes</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>http://%s/hobby</loc>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>
    <url>
        <loc>http://%s/hobby</loc>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>
</urlset>`

	fmt.Fprintf(w, sitemap, r.Host, r.Host, r.Host, r.Host, r.Host)
}

// notFoundHandler обработчик для 404 страниц
func notFoundHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusNotFound)

	// Проверяем, не пытается ли кто-то получить доступ к служебным файлам
	suspiciousExtensions := []string{".php", ".asp", ".jsp", ".cgi", ".pl", ".py", ".rb", ".sh"}
	for _, ext := range suspiciousExtensions {
		if strings.HasSuffix(r.URL.Path, ext) {
			// Дополнительное логирование подозрительных запросов
			log.Printf("[SECURITY WARNING] Attempt to access script file: %s from %s", r.URL.Path, r.RemoteAddr)
			break
		}
	}

	// Можно создать красивую 404 страницу
	tmpl := `
    <!DOCTYPE html>
    <html lang="ru">
    <head>
        <meta charset="UTF-8">
        <title>404 - Страница не найдена</title>
        <style>
            body {
                background: #000;
                color: #fff;
                font-family: 'Inter', sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
            }
            .error-container {
                text-align: center;
            }
            h1 {
                font-size: 6rem;
                margin: 0;
                opacity: 0.8;
            }
            p {
                font-size: 1.2rem;
                opacity: 0.6;
            }
            a {
                color: #fff;
                text-decoration: none;
                border: 1px solid #fff;
                padding: 10px 20px;
                display: inline-block;
                margin-top: 20px;
                transition: all 0.3s;
            }
            a:hover {
                background: #fff;
                color: #000;
            }
        </style>
    </head>
    <body>
        <div class="error-container">
            <h1>404</h1>
            <p>Страница не найдена</p>
            <p>Запрошенный путь: <code>%s</code></p>
            <a href="/">Вернуться на главную</a>
        </div>
    </body>
    </html>
    `
	fmt.Fprintf(w, tmpl, r.URL.Path)
}

// Создание необходимых директорий
func createDirectories() error {
	dirs := []string{
		"content",
		"content/notes",
		"content/articles",
		"templates",
		"static/css",
		"static/js",
	}

	for _, dir := range dirs {
		if err := os.MkdirAll(dir, 0755); err != nil {
			return err
		}
	}

	return nil
}

// Middleware для логирования
func loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		next.ServeHTTP(w, r)
		log.Printf("%s %s %v", r.Method, r.URL.Path, time.Since(start))
	})
}

// Главная функция
func main() {
	// Создание необходимых директорий
	if err := createDirectories(); err != nil {
		log.Fatal(err)
	}

	// Настройка маршрутов
	http.HandleFunc("/", homeHandler)
	http.HandleFunc("/resume", resumeHandler)
	http.HandleFunc("/hobby", hobbyHandler)
	http.HandleFunc("/notes", notesHandler)
	http.HandleFunc("/notes/", noteHandler)
	http.HandleFunc("/articles", articlesHandler)
	http.HandleFunc("/articles/", articleHandler)
	http.HandleFunc("/projects", projectsHandler)
	// robots.txt
	http.HandleFunc("/robots.txt", robotsHandler)
	// sitemap.xml
	http.HandleFunc("/sitemap.xml", sitemapHandler)
	// Обработчик 404 для всех остальных путей
	http.HandleFunc("/404", notFoundHandler)
	// Статические файлы
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("static/"))))

	// Применение middleware
	handler := loggingMiddleware(http.DefaultServeMux)

	fmt.Println("🚀 Сервер запущен на http://localhost:8080")
	fmt.Println("📁 Структура файлов:")
	fmt.Println("   content/resume.md - резюме")
	fmt.Println("   content/hobby.md - хобби")
	fmt.Println("   content/notes/ - заметки")
	fmt.Println("   content/articles/ - статьи")
	fmt.Println("📝 Формат: ДД.ММ.ГГГГ-Название.md")

	log.Fatal(http.ListenAndServe(":8080", handler))
}
