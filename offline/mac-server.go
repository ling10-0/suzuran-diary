package main

import (
	"flag"
	"fmt"
	"io"
	"log"
	"mime"
	"net"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"time"
)

const host = "127.0.0.2"

func main() {
	fixedPort := flag.Int("port", 0, "fixed local port (default: scan 1938-1948)")
	noBrowser := flag.Bool("no-browser", false, "do not open the browser automatically")
	flag.Parse()

	exe, err := os.Executable()
	if err != nil {
		log.Fatalf("cannot locate launcher: %v", err)
	}
	root := filepath.Join(filepath.Dir(exe), "game")
	if info, err := os.Stat(root); err != nil || !info.IsDir() {
		log.Fatalf("game folder not found next to launcher: %s", root)
	}

	ports := make([]int, 0, 11)
	if *fixedPort > 0 {
		ports = append(ports, *fixedPort)
	} else {
		for p := 1938; p <= 1948; p++ {
			ports = append(ports, p)
		}
	}

	var listener net.Listener
	var port int
	for _, candidate := range ports {
		ln, err := net.Listen("tcp4", fmt.Sprintf("%s:%d", host, candidate))
		if err == nil {
			listener = ln
			port = candidate
			break
		}
	}
	if listener == nil {
		log.Fatalf("no local port available")
	}
	defer listener.Close()

	url := fmt.Sprintf("http://%s:%d/?offline=1", host, port)
	fmt.Printf("READY %s\n", url)
	fmt.Println("Keep this Terminal window open while playing. Close it to stop the offline server.")

	mux := http.NewServeMux()
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		serveGame(root, w, r)
	})

	server := &http.Server{
		Handler:           mux,
		ReadHeaderTimeout: 5 * time.Second,
	}

	if !*noBrowser {
		go func() {
			time.Sleep(350 * time.Millisecond)
			_ = exec.Command("open", url).Start()
		}()
	}

	if err := server.Serve(listener); err != nil && err != http.ErrServerClosed {
		log.Fatalf("offline server stopped: %v", err)
	}
}

func serveGame(root string, w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet && r.Method != http.MethodHead {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}

	requestPath := strings.TrimPrefix(r.URL.Path, "/")
	if requestPath == "" {
		requestPath = "index.html"
	}

	clean := filepath.Clean(filepath.FromSlash(requestPath))
	candidate := filepath.Join(root, clean)
	if !insideRoot(root, candidate) {
		http.Error(w, "Forbidden", http.StatusForbidden)
		return
	}

	info, err := os.Stat(candidate)
	if err != nil || info.IsDir() {
		candidate = filepath.Join(root, "index.html")
	}

	file, err := os.Open(candidate)
	if err != nil {
		http.Error(w, "Not Found", http.StatusNotFound)
		return
	}
	defer file.Close()

	info, err = file.Stat()
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	contentType := mime.TypeByExtension(strings.ToLower(filepath.Ext(candidate)))
	if contentType == "" {
		contentType = "application/octet-stream"
	}
	w.Header().Set("Content-Type", contentType)
	w.Header().Set("Cache-Control", "no-store, max-age=0")
	w.Header().Set("X-Content-Type-Options", "nosniff")
	w.Header().Set("Content-Length", fmt.Sprintf("%d", info.Size()))
	w.WriteHeader(http.StatusOK)
	if r.Method == http.MethodHead {
		return
	}
	_, _ = io.Copy(w, file)
}

func insideRoot(root, candidate string) bool {
	rootAbs, err := filepath.Abs(root)
	if err != nil {
		return false
	}
	candidateAbs, err := filepath.Abs(candidate)
	if err != nil {
		return false
	}
	rel, err := filepath.Rel(rootAbs, candidateAbs)
	if err != nil {
		return false
	}
	return rel == "." || (rel != ".." && !strings.HasPrefix(rel, ".."+string(os.PathSeparator)))
}
