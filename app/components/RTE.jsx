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
              ],
              toolbar:
                'undo redo | blocks | image | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
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
                ],
                toolbar:
                  'undo redo | blocks | image | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
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
