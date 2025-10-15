import type { FactCheckResponse } from "../types";
import { Verdict } from "../types";

const MOCK_DB: Record<string, FactCheckResponse> = {
  "5G_FALSE": {
    user_claim: "5G towers spread coronavirus",
    matched_claim: "5G mobile networks spread COVID-19",
    similarity_score: 92.4,
    verdict: Verdict.FALSE,
    verdict_icon: "❌",
    source: "WHO Mythbusters",
    source_url:
      "https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public/myth-busters#5g",
    category: "COVID-19",
    evidence_score: 10,
    recommendation:
      "This claim has been debunked by the World Health Organization. Viruses cannot travel on radio waves or mobile networks. COVID-19 is spread through respiratory droplets when an infected person coughs, sneezes or speaks.",
    date_fact_checked: "2020-04-08",
  },
  HANDWASHING_TRUE: {
    user_claim: "Washing hands prevents infections",
    matched_claim: "Regular handwashing protects against COVID-19 infection",
    similarity_score: 95.8,
    verdict: Verdict.TRUE,
    verdict_icon: "✅",
    source: "CDC",
    source_url: "https://www.cdc.gov/handwashing/when-how-handwashing.html",
    category: "General Health",
    evidence_score: 95,
    recommendation:
      "This claim is supported by health authorities like the CDC. Frequent handwashing with soap and water for at least 20 seconds is one of the most effective ways to prevent the spread of germs, including the virus that causes COVID-19.",
    date_fact_checked: "2021-10-26",
  },
  IVERMECTIN_MISLEADING: {
    user_claim: "ivermectin cures covid",
    matched_claim: "Ivermectin is an effective treatment for COVID-19",
    similarity_score: 88.1,
    verdict: Verdict.MISLEADING,
    verdict_icon: "⚠️",
    source: "FDA",
    source_url:
      "https://www.fda.gov/consumers/consumer-updates/why-you-should-not-use-ivermectin-treat-or-prevent-covid-19",
    category: "COVID-19 Treatment",
    evidence_score: 30,
    recommendation:
      "The FDA has not authorized or approved ivermectin for use in preventing or treating COVID-19. While some initial research was conducted, large-scale clinical trials have not shown it to be an effective treatment. Taking large doses of this drug is dangerous.",
    date_fact_checked: "2022-03-15",
  },
  VACCINE_AUTISM_FALSE: {
    user_claim: "vaccines cause autism",
    matched_claim: "Childhood vaccines are linked to autism spectrum disorder.",
    similarity_score: 98.2,
    verdict: Verdict.FALSE,
    verdict_icon: "❌",
    source: "Centers for Disease Control and Prevention (CDC)",
    source_url: "https://www.cdc.gov/vaccinesafety/concerns/autism.html",
    category: "Vaccine Safety",
    evidence_score: 5,
    recommendation:
      "This claim is false. Numerous large-scale scientific studies have found no link between vaccines, or their ingredients, and autism. The original 1998 study that suggested a link was retracted due to serious procedural errors, undisclosed financial conflicts of interest, and ethical violations.",
    date_fact_checked: "2019-11-12",
  },
  ALKALINE_DIET_FALSE: {
    user_claim: "alkaline diet cures cancer",
    matched_claim: "Eating an alkaline diet can treat or cure cancer.",
    similarity_score: 91.5,
    verdict: Verdict.FALSE,
    verdict_icon: "❌",
    source: "MD Anderson Cancer Center",
    source_url:
      "https://www.mdanderson.org/cancerwise/alkaline-diet-what-you-need-to-know.h00-159385038.html",
    category: "Cancer Treatment Myths",
    evidence_score: 8,
    recommendation:
      "This claim is false. There is no scientific evidence that an alkaline diet can prevent or cure cancer. The body naturally maintains a tightly controlled pH balance regardless of diet. While eating more fruits and vegetables is healthy, it does not change the body's pH or affect cancer cells.",
    date_fact_checked: "2021-06-22",
  },
  VITAMIN_C_MISLEADING: {
    user_claim: "vitamin c prevents colds",
    matched_claim:
      "Taking high doses of Vitamin C can prevent the common cold.",
    similarity_score: 85.3,
    verdict: Verdict.MISLEADING,
    verdict_icon: "⚠️",
    source: "National Institutes of Health (NIH)",
    source_url:
      "https://ods.od.nih.gov/factsheets/VitaminC-HealthProfessional/#h8",
    category: "Supplements & Colds",
    evidence_score: 45,
    recommendation:
      "For most people, taking Vitamin C supplements regularly does not prevent colds but may slightly reduce a cold's duration or severity. Taking a supplement only after a cold starts does not appear to be helpful. A balanced diet is the best source of vitamins.",
    date_fact_checked: "2023-01-10",
  },
  SUNSCREEN_TRUE: {
    user_claim: "sunscreen prevents skin cancer",
    matched_claim:
      "Using sunscreen regularly helps prevent the development of skin cancer.",
    similarity_score: 96.0,
    verdict: Verdict.TRUE,
    verdict_icon: "✅",
    source: "Skin Cancer Foundation",
    source_url:
      "https://www.skincancer.org/skin-cancer-prevention/sun-protection/sunscreen/",
    category: "Cancer Prevention",
    evidence_score: 98,
    recommendation:
      "This is true. Broad-spectrum sunscreens with an SPF of 15 or higher are proven to significantly reduce the risk of developing squamous cell carcinoma, melanoma, and premature skin aging when used as directed with other sun protection measures.",
    date_fact_checked: "2022-05-18",
  },
  DETOX_TEA_FALSE: {
    user_claim: "detox teas work",
    matched_claim:
      "Detox teas and cleanses are effective at removing toxins from the body.",
    similarity_score: 89.9,
    verdict: Verdict.FALSE,
    verdict_icon: "❌",
    source: "Cleveland Clinic",
    source_url: "https://health.clevelandclinic.org/what-does-a-detox-tea-do",
    category: "Wellness & Diet",
    evidence_score: 15,
    recommendation:
      "This claim is false. There is no scientific evidence that detox teas provide any health benefits. The human body has its own highly effective detoxification system: the liver and kidneys. These teas often contain laxatives, which can be harmful with prolonged use.",
    date_fact_checked: "2022-09-01",
  },
  MICROWAVE_NUTRIENTS_FALSE: {
    user_claim: "microwaves kill nutrients",
    matched_claim: "Microwaving food destroys its nutritional value.",
    similarity_score: 93.1,
    verdict: Verdict.FALSE,
    verdict_icon: "❌",
    source: "Harvard Health Publishing",
    source_url:
      "https://www.health.harvard.edu/staying-healthy/microwave-cooking-and-nutrition",
    category: "Food & Nutrition",
    evidence_score: 20,
    recommendation:
      "This claim is false. Because microwave cooking times are shorter and use less water, this method often retains more vitamins and minerals than other cooking methods like boiling. The best cooking method for nutrient retention varies by nutrient and food type.",
    date_fact_checked: "2020-11-30",
  },
  UNVERIFIED: {
    user_claim: "",
    matched_claim: null,
    similarity_score: 0,
    verdict: Verdict.UNVERIFIED,
    verdict_icon: "❓",
    source: "N/A",
    source_url: null,
    category: "N/A",
    evidence_score: 0,
    recommendation:
      "We could not find a close match for this claim in our fact-check database. This does not mean the claim is true or false. Please consult a qualified healthcare professional and trusted public health websites for more information.",
    date_fact_checked: null,
  },
};

export const checkMedicalClaim = async (
  claim: string
): Promise<FactCheckResponse> => {
  console.log("Checking claim:", claim);

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const lowerCaseClaim = claim.toLowerCase();

  if (lowerCaseClaim.includes("5g")) {
    return { ...MOCK_DB["5G_FALSE"], user_claim: claim };
  }
  if (lowerCaseClaim.includes("wash") && lowerCaseClaim.includes("hand")) {
    return { ...MOCK_DB["HANDWASHING_TRUE"], user_claim: claim };
  }
  if (lowerCaseClaim.includes("ivermectin")) {
    return { ...MOCK_DB["IVERMECTIN_MISLEADING"], user_claim: claim };
  }
  if (lowerCaseClaim.includes("vaccine") && lowerCaseClaim.includes("autism")) {
    return { ...MOCK_DB["VACCINE_AUTISM_FALSE"], user_claim: claim };
  }
  if (
    lowerCaseClaim.includes("alkaline") &&
    lowerCaseClaim.includes("cancer")
  ) {
    return { ...MOCK_DB["ALKALINE_DIET_FALSE"], user_claim: claim };
  }
  if (
    lowerCaseClaim.includes("vitamin c") &&
    (lowerCaseClaim.includes("cold") || lowerCaseClaim.includes("prevent"))
  ) {
    return { ...MOCK_DB["VITAMIN_C_MISLEADING"], user_claim: claim };
  }
  if (
    lowerCaseClaim.includes("sunscreen") &&
    lowerCaseClaim.includes("cancer")
  ) {
    return { ...MOCK_DB["SUNSCREEN_TRUE"], user_claim: claim };
  }
  if (
    lowerCaseClaim.includes("detox") &&
    (lowerCaseClaim.includes("tea") || lowerCaseClaim.includes("cleanse"))
  ) {
    return { ...MOCK_DB["DETOX_TEA_FALSE"], user_claim: claim };
  }
  if (
    lowerCaseClaim.includes("microwave") &&
    (lowerCaseClaim.includes("nutrient") || lowerCaseClaim.includes("kill"))
  ) {
    return { ...MOCK_DB["MICROWAVE_NUTRIENTS_FALSE"], user_claim: claim };
  }

  // Return "UNVERIFIED" if no match is found
  return { ...MOCK_DB["UNVERIFIED"], user_claim: claim };
};
