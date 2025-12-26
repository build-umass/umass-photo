import Markdown from "react-markdown";

export default function MarkdownElement({ content }: { content: string }) {
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
      }}
    >
      {content}
    </Markdown>
  );
}
