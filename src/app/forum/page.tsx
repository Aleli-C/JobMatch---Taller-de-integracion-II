import Forum from "../../components/Forum";
import ForumFilterbar from "../../components/ForumFilterbar";

export default function ForumPage() {
  return (
    <main className="max-w-6xl mx-auto p-4 space-y-6">
      <ForumFilterbar />
      <Forum />
    </main>
  );
}
