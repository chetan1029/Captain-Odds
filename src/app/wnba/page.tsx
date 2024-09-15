import Breadcrumbs from "../components/Breadcrumbs";

export default function Dashboard() {
  // Function to get today's date in the desired format
  const getTodayDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const breadcrumbs = [{ name: "WNBA", href: "" }];

  return (
    <main className="flex-grow">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 mb-20 pt-4">
        <Breadcrumbs breadcrumbs={breadcrumbs} />
      </div>
    </main>
  );
}
