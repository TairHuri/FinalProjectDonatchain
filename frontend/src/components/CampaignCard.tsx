type Props = {
  title: string
  description: string
}
export default function CampaignCard({ title, description }: Props) {
  return (
    <div className="p-5 bg-white border rounded-2xl shadow hover:shadow-lg transition">
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      <p className="text-gray-600 mt-2">{description}</p>
      <button className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
        תרום עכשיו
      </button>
    </div>
  );
}

