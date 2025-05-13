"use client"

import React from "react"
import ReactMarkdown from "react-markdown"

interface FormattedMessageProps {
  content: string
  className?: string
}

export function FormattedMessage({ content, className = "" }: FormattedMessageProps) {
  return (
    <div className={`prose prose-sm max-w-none dark:prose-invert ${className}`}>
      <ReactMarkdown
        components={{
          // Style headings
          h1: ({ node, ...props }) => <h1 className="text-lg font-bold mt-2 mb-1" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-base font-bold mt-2 mb-1" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-sm font-bold mt-2 mb-1" {...props} />,
          
          // Style lists
          ul: ({ node, ...props }) => <ul className="list-disc pl-4 my-1" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal pl-4 my-1" {...props} />,
          li: ({ node, ...props }) => <li className="my-0.5" {...props} />,
          
          // Style paragraphs
          p: ({ node, ...props }) => <p className="my-1" {...props} />,
          
          // Style bold and italic
          strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
          em: ({ node, ...props }) => <em className="italic" {...props} />,
          
          // Style links
          a: ({ node, ...props }) => (
            <a className="text-primary underline hover:text-primary/80" target="_blank" rel="noopener noreferrer" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}