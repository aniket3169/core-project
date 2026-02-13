import { NextResponse } from "next/server";
import { searchFactCheck } from "@/lib/factCheck";

export async function POST(req) {
  try {
    const { question } = await req.json();
    const data = await searchFactCheck(question);

    const claim = data.claims?.[0];

    if (!claim) {
      return NextResponse.json({
        answer: "No verified fact-check found for this query.",
      });
    }

    const review = claim.claimReview?.[0];

    return NextResponse.json({
      answer: `
Claim: ${claim.text}
Rating: ${review?.textualRating || "Unknown"}
Source: ${review?.publisher?.name || "Unknown"}
      `.trim(),
    });
  } catch (err) {
    return NextResponse.json(
      { answer: err.message },
      { status: 500 }
    );
  }
}
