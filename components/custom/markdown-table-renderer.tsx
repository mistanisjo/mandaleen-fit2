import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"; // Assuming shadcn/ui table components are here

interface MarkdownTableRendererProps {
  markdownContent: string;
}

const MarkdownTableRenderer: React.FC<MarkdownTableRendererProps> = ({
  markdownContent,
}) => {
  const markdownComponents: Components = {
    table: ({ node, ...props }) => (
      <div className="my-6 w-full overflow-x-auto rounded-lg shadow-sm border">
        <Table {...props} className="min-w-full" />
      </div>
    ),
    thead: ({ node, ...props }) => <TableHeader {...props} />,
    tbody: ({ node, ...props }) => <TableBody {...props} />,
    tr: ({ node, ...props }) => (
      <TableRow
        {...props}
        className="border-b transition-colors odd:bg-gray-50 dark:odd:bg-gray-800 even:bg-white dark:even:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 data-[state=selected]:bg-muted"
      />
    ),
    th: ({ node, ...props }) => (
      <TableHead
        {...props}
        className="h-12 px-4 text-left align-middle font-bold text-primary-foreground bg-gradient-to-r from-orange-500 to-red-500 [&:has([role=checkbox])]:pr-0 [&:not(:last-child)]:border-r"
      />
    ),
    td: ({ node, ...props }) => (
      <TableCell
        {...props}
        className="p-4 align-middle text-foreground/80 dark:text-foreground [&:has([role=checkbox])]:pr-0 [&:not(:last-child)]:border-r"
      />
    ),
    // You can add custom renderers for other elements here if needed
    // For example, to style headings, paragraphs, lists, etc.
    // h1: ({node, ...props}) => <h1 className="text-2xl font-bold my-4" {...props} />,
    // p: ({node, ...props}) => <p className="my-2" {...props} />,
  };

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
      {markdownContent}
    </ReactMarkdown>
  );
};

export default MarkdownTableRenderer;
