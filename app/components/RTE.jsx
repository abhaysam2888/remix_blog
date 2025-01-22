import React, { useEffect, useState } from 'react'
import { Controller } from 'react-hook-form'
import conf from '../conf/conf'
import { Editor } from '@tinymce/tinymce-react'

function RTE({ name, control, label, defaultValue = '' }) {
  const [editorState, setEditorState] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setEditorState(true)
    }, 1000)
  }, [])

  if (!editorState) {
    return (
      <div className="w-full justify-center flex">
        <div className="loading-container mt-[15%] max-sm:mt-[30%] max-[450px]:mt-[50%]">
          <div className="loading-bar">
            <div className="progress"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {label && (
        <label className="inline-block mb-1 pl-1 text-white">{label}</label>
      )}

      <Controller
        name={name || 'content'}
        control={control}
        render={({ field: { onChange } }) => (
          <Editor
            apiKey={conf.tinyMiceApiKey}
            initialValue={defaultValue}
            init={{
              height: 500,
              menubar: true,
              insertdatetime_dateformat: '%d-%m-%Y',
              codesample_languages: [
                { text: 'HTML/XML', value: 'markup' },
                { text: 'JavaScript', value: 'javascript' },
                { text: 'CSS', value: 'css' },
                { text: 'PHP', value: 'php' },
                { text: 'Ruby', value: 'ruby' },
                { text: 'Python', value: 'python' },
                { text: 'Java', value: 'java' },
                { text: 'C', value: 'c' },
                { text: 'C#', value: 'csharp' },
                { text: 'C++', value: 'cpp' }
              ],
              plugins: [
                'advlist',
                'autolink',
                'lists',
                'link',
                'charmap',
                'preview',
                'anchor',
                'searchreplace',
                'visualblocks',
                'code',
                'fullscreen',
                'insertdatetime',
                'media',
                'table',
                'help',
                'wordcount',
                'linkchecker ',
                'autolink ',
                'link ',
                'autosave',
                'codesample',
                'emoticons',
                'insertdatetime'
              ],
              toolbar:
                'undo redo | blocks | image | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help | restoredraft | codesample | emoticons | insertdatetime',
              content_style:
                'body { font-family:Helvetica,Arial,sans-serif; font-size:14px; }',
              mobile: {
                menubar: true,
                plugins: [
                  'advlist',
                  'autolink',
                  'lists',
                  'link',
                  'charmap',
                  'preview',
                  'anchor',
                  'searchreplace',
                  'visualblocks',
                  'code',
                  'fullscreen',
                  'insertdatetime',
                  'media',
                  'table',
                  'help',
                  'wordcount',
                  'codesample',
                  'emoticons',
                ],
                toolbar:
                  'undo redo | blocks | image | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help | codesample | emoticons',
              },
            }}
            onEditorChange={onChange}
          />
        )}
      />
    </div>
  )
}

export default RTE
