import AdminPageButton from "./AdminPageButton";

export default function TableEditorHeader({
  tableName,
  onSave,
}: {
  tableName: string;
  onSave: () => void;
}) {
  return (
    <header className="flex justify-between">
      <h1 className="text-umass-red text-6xl font-bold">{tableName}</h1>
      <AdminPageButton onClick={onSave}>SAVE</AdminPageButton>
    </header>
  );
}
