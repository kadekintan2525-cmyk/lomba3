export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { umur, tinggi, berat } = req.body;

  const prompt = `
  Anak usia ${umur} bulan, tinggi ${tinggi} cm, berat ${berat} kg.
  Analisis apakah berisiko stunting atau tidak.
  Berikan:
  1. Status (Normal / Risiko Stunting)
  2. Penjelasan singkat
  3. Rekomendasi makanan sehat
  `;

  const response = await fetch("https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=" + process.env.GEMINI_API_KEY, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });

  const data = await response.json();

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Tidak ada respon";

  res.status(200).json({ result: text });
}
