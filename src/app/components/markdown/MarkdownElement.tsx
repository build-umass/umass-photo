import { remark } from 'remark';
import html from 'remark-html';

export default function MarkdownElement({content}: {content: string}){
    const htmlContent = remark().use(html).processSync(content).toString();
    return  <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
}