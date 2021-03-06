import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
  useCallback,
  useState,
} from 'react'
import { File } from '../Editor'
import { ExercismMonacoEditor } from './ExercismMonacoEditor'
import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api'
import { useStorage } from '../../../utils/use-storage'

export type FileEditorHandle = {
  getFile: () => File
}

type FileEditorProps = {
  file: File
  language: string
  onRunTests: () => void
}

const SAVE_INTERVAL = 500

export const FileEditor = forwardRef<FileEditorHandle, FileEditorProps>(
  ({ file, language, onRunTests }, ref) => {
    const [theme, setTheme] = useState('vs')
    const [options, setOptions] = useState<
      monacoEditor.editor.IStandaloneEditorConstructionOptions
    >({
      minimap: { enabled: false },
      wordWrap: 'on',
      glyphMargin: true,
      lightbulb: { enabled: true },
    })
    const [content, setContent] = useStorage<string>(
      `${file.filename}-editor-content`,
      file.content
    )
    const editorRef = useRef<monacoEditor.editor.IStandaloneCodeEditor>()
    const editorDidMount = useCallback(
      (editor) => {
        editorRef.current = editor
      },
      [editorRef]
    )
    const handleWrapChange = useCallback(
      (e) => {
        setOptions({ ...options, wordWrap: e.target.value })
      },
      [setOptions]
    )
    const handleThemeChange = useCallback(
      (e) => {
        setTheme(e.target.value)
      },
      [setTheme]
    )
    const revertContent = useCallback(
      (e) => {
        setContent(file.content)
      },
      [setContent, file]
    )

    useImperativeHandle(ref, () => ({
      getFile() {
        return {
          filename: file.filename,
          content: editorRef.current?.getValue() || '',
        }
      },
    }))

    useEffect(() => {
      const interval = setInterval(() => {
        setContent(editorRef.current?.getValue())
      }, SAVE_INTERVAL)

      return () => clearInterval(interval)
    }, [])

    return (
      <div>
        <label htmlFor={`${file.filename}-editor-wrap`}>Wrap</label>
        <select
          id={`${file.filename}-editor-wrap`}
          value={options.wordWrap}
          onChange={handleWrapChange}
        >
          <option value="off">Off</option>
          <option value="on">On</option>
        </select>
        <label htmlFor={`${file.filename}-editor-theme`}>Theme</label>
        <select
          id={`${file.filename}-editor-theme`}
          value={theme}
          onChange={handleThemeChange}
        >
          <option value="vs">Light</option>
          <option value="vs-dark">Dark</option>
        </select>
        {content !== file.content && (
          <button onClick={revertContent} type="button">
            Revert to last run code
          </button>
        )}
        <ExercismMonacoEditor
          key={file.filename}
          width="800"
          height="600"
          language={language}
          editorDidMount={editorDidMount}
          onRunTests={onRunTests}
          options={options}
          value={content}
          theme={theme}
        />
      </div>
    )
  }
)
