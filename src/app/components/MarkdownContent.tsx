import Markdown from "react-markdown";

/**
 * A component which renders markdown content as HTML.
 * @param param0.children The markdown content to render.
 *
 * @example
 * ```jsx
 * <MarkdownContent># Hello World</MarkdownContent>
 * ```
 * Will render as
 * ```html
 * <h1>Hello World</h1>
 * ```
 */
export default function MarkdownContent({ children }: { children: string }) {
  return (
    <Markdown
      components={{
        h1(props) {
          return (
            <h1
              {...props}
              className="text-umass-red my-4 text-3xl font-bold"
            ></h1>
          );
        },
        h2(props) {
          return (
            <h2
              {...props}
              className="my-4 text-3xl font-bold text-gray-500"
            ></h2>
          );
        },
        h3(props) {
          return (
            <h3
              {...props}
              className="text-umass-red my-4 text-2xl font-bold"
            ></h3>
          );
        },
        h4(props) {
          return (
            <h4
              {...props}
              className="my-4 text-2xl font-bold text-gray-500"
            ></h4>
          );
        },
        h5(props) {
          return (
            <h5
              {...props}
              className="text-umass-red my-4 text-xl font-bold"
            ></h5>
          );
        },
        h6(props) {
          return (
            <h6
              {...props}
              className="my-4 text-xl font-bold text-gray-500"
            ></h6>
          );
        },
        a(props) {
          if (props.href) return <a {...props} className="text-blue-500"></a>;
        },
        ul(props) {
          return <ul {...props} className="list-disc pl-6"></ul>;
        },
      }}
    >
      {children}
    </Markdown>
  );
}
