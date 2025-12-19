import Markdown from "react-markdown";

export default function MarkdownElement({ content }: { content: string }) {
    return <Markdown
        components={{
            h1(props) {
                return <h1 {...props} className="text-3xl text-umass-red font-bold my-4"></h1>;
            },
            h2(props) {
                return <h2 {...props} className="text-3xl text-gray-500 font-bold my-4"></h2>;
            },
            h3(props) {
                return <h3 {...props} className="text-2xl text-umass-red font-bold my-4"></h3>;
            },
            h4(props) {
                return <h4 {...props} className="text-2xl text-gray-500 font-bold my-4"></h4>;
            },
            h5(props) {
                return <h5 {...props} className="text-xl text-umass-red font-bold my-4"></h5>;
            },
            h6(props) {
                return <h6 {...props} className="text-xl text-gray-500 font-bold my-4"></h6>;
            },
            a(props) {
                if(props.href)
                    return <a {...props} className="text-blue-500"></a>
            }
        }}>{content}</Markdown > }