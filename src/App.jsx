import { useState, useEffect } from "react"
import "prismjs/themes/prism-tomorrow.css"
import Editor from "react-simple-code-editor"
import prism from "prismjs"
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/github-dark.css"
import axios from "axios"
import "./App.css"
import { Oval } from "react-loader-spinner"

function App() {
  const [count, setCount] = useState(0)
  const [code, setCode] = useState(` function sum() {
  return 1 + 1
}`)
  const [review, setReview] = useState(``)
  const [loading, setLoading] = useState(false)
  const [showAnimation, setShowAnimation] = useState(true)

  useEffect(() => {
    prism.highlightAll()
  }, [])

  async function reviewCode() {
    setLoading(true)
    setShowAnimation(false)
    const response = await axios.post("https://codelens-backend-ueh8.onrender.com/ai/get-review", { code })
    setReview(response.data)
    setLoading(false)
  }

  return (
    <>
      <main>
        <div className="left">
          <div className="code">
            <Editor
              value={code}
              onValueChange={(code) => setCode(code)}
              highlight={(code) => prism.highlight(code, prism.languages.javascript, "javascript")}
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 16,
                border: "1px solid #ddd",
                borderRadius: "5px",
                height: "100%",
                width: "100%",
              }}
            />
          </div>
          <div onClick={reviewCode} className="review">
            {loading ? <Oval color="#000000" height={30} width={30} /> : "Review"}
          </div>
        </div>
        <div className="right">
          {showAnimation && !review && (
            <div className="animation-container">
              <div className="code-lines"></div>
              <div className="cursor"></div>
            </div>
          )}
          {review && <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>}
        </div>
      </main>
    </>
  )
}

export default App

