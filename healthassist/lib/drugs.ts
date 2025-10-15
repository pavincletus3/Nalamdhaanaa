export type DrugAlternative = {
  name: string;
  price: number;
  availability: "high" | "medium" | "low";
};

export type Drug = {
  name: string;
  generic_name: string;
  category: string;
  shortage_risk: number;
  risk_factors: string[];
  alternatives: DrugAlternative[];
  average_price: number;
};

export const drugs: Drug[] = [
  {
    name: "Paracetamol 500mg",
    generic_name: "Acetaminophen",
    category: "Pain Relief",
    shortage_risk: 0.35,
    risk_factors: ["seasonal_demand"],
    alternatives: [
      { name: "Ibuprofen 400mg", price: 40, availability: "high" },
      { name: "Aspirin 300mg", price: 20, availability: "high" },
    ],
    average_price: 30,
  },
  {
    name: "Amoxicillin 500mg",
    generic_name: "Amoxicillin",
    category: "Antibiotic",
    shortage_risk: 0.78,
    risk_factors: ["single_manufacturer", "supply_chain_issues", "high_demand"],
    alternatives: [
      { name: "Azithromycin 500mg", price: 180, availability: "medium" },
      { name: "Cephalexin 500mg", price: 120, availability: "high" },
    ],
    average_price: 75,
  },
  {
    name: "Metformin 500mg",
    generic_name: "Metformin",
    category: "Diabetes",
    shortage_risk: 0.42,
    risk_factors: ["increased_global_demand"],
    alternatives: [
      { name: "Gliclazide 80mg", price: 90, availability: "high" },
      { name: "Sitagliptin 100mg", price: 250, availability: "medium" },
    ],
    average_price: 50,
  },
  {
    name: "Azithromycin 500mg",
    generic_name: "Azithromycin",
    category: "Antibiotic",
    shortage_risk: 0.72,
    risk_factors: ["raw_material_scarcity", "geopolitical_issues"],
    alternatives: [
      { name: "Clarithromycin 500mg", price: 220, availability: "medium" },
      { name: "Doxycycline 100mg", price: 150, availability: "high" },
    ],
    average_price: 180,
  },
  {
    name: "Amlodipine 5mg",
    generic_name: "Amlodipine",
    category: "Hypertension",
    shortage_risk: 0.3,
    risk_factors: ["multiple_suppliers"],
    alternatives: [
      { name: "Lisinopril 10mg", price: 45, availability: "high" },
      { name: "Losartan 50mg", price: 60, availability: "high" },
    ],
    average_price: 40,
  },
  {
    name: "Ibuprofen 400mg",
    generic_name: "Ibuprofen",
    category: "Pain Relief",
    shortage_risk: 0.25,
    risk_factors: ["stable_supply", "wide_availability"],
    alternatives: [
      { name: "Paracetamol 500mg", price: 30, availability: "high" },
      { name: "Naproxen 250mg", price: 55, availability: "high" },
    ],
    average_price: 40,
  },
  {
    name: "Lisinopril 10mg",
    generic_name: "Lisinopril",
    category: "Hypertension",
    shortage_risk: 0.38,
    risk_factors: ["generic_competition"],
    alternatives: [
      { name: "Amlodipine 5mg", price: 40, availability: "high" },
      { name: "Ramipril 5mg", price: 50, availability: "high" },
    ],
    average_price: 45,
  },
  {
    name: "Atorvastatin 20mg",
    generic_name: "Atorvastatin",
    category: "Cholesterol",
    shortage_risk: 0.55,
    risk_factors: ["patent_expiration_effects", "high_demand"],
    alternatives: [
      { name: "Rosuvastatin 10mg", price: 100, availability: "medium" },
      { name: "Simvastatin 20mg", price: 80, availability: "high" },
    ],
    average_price: 90,
  },
  {
    name: "Salbutamol Inhaler",
    generic_name: "Albuterol",
    category: "Asthma",
    shortage_risk: 0.65,
    risk_factors: ["manufacturing_delays", "high_seasonal_demand"],
    alternatives: [
      { name: "Levalbuterol Inhaler", price: 400, availability: "low" },
      {
        name: "Ipratropium Bromide Inhaler",
        price: 350,
        availability: "medium",
      },
    ],
    average_price: 250,
  },
  {
    name: "Omeprazole 20mg",
    generic_name: "Omeprazole",
    category: "Acid Reflux",
    shortage_risk: 0.2,
    risk_factors: ["multiple_generic_versions", "stable_demand"],
    alternatives: [
      { name: "Pantoprazole 40mg", price: 70, availability: "high" },
      { name: "Ranitidine 150mg", price: 50, availability: "medium" },
    ],
    average_price: 60,
  },
  {
    name: "Cetirizine 10mg",
    generic_name: "Cetirizine",
    category: "Allergy",
    shortage_risk: 0.15,
    risk_factors: ["wide_availability", "many_manufacturers"],
    alternatives: [
      { name: "Loratadine 10mg", price: 35, availability: "high" },
      { name: "Fexofenadine 120mg", price: 65, availability: "high" },
    ],
    average_price: 30,
  },
  {
    name: "Sertraline 50mg",
    generic_name: "Sertraline",
    category: "Antidepressant",
    shortage_risk: 0.58,
    risk_factors: ["api_sourcing_issues", "regulatory_changes"],
    alternatives: [
      { name: "Escitalopram 10mg", price: 120, availability: "medium" },
      { name: "Fluoxetine 20mg", price: 90, availability: "high" },
    ],
    average_price: 100,
  },
  {
    name: "Ciprofloxacin 500mg",
    generic_name: "Ciprofloxacin",
    category: "Antibiotic",
    shortage_risk: 0.68,
    risk_factors: [
      "bacterial_resistance_concerns",
      "production_line_contamination",
    ],
    alternatives: [
      { name: "Levofloxacin 500mg", price: 200, availability: "medium" },
      { name: "Ofloxacin 400mg", price: 180, availability: "high" },
    ],
    average_price: 150,
  },
  {
    name: "Losartan 50mg",
    generic_name: "Losartan",
    category: "Hypertension",
    shortage_risk: 0.45,
    risk_factors: ["product_recall_history", "increased_demand"],
    alternatives: [
      { name: "Valsartan 80mg", price: 70, availability: "high" },
      { name: "Irbesartan 150mg", price: 80, availability: "high" },
    ],
    average_price: 60,
  },
  {
    name: "Gabapentin 300mg",
    generic_name: "Gabapentin",
    category: "Neuropathic Pain",
    shortage_risk: 0.62,
    risk_factors: ["off-label_use_increase", "supply_chain_disruptions"],
    alternatives: [
      { name: "Pregabalin 75mg", price: 250, availability: "medium" },
      { name: "Amitriptyline 25mg", price: 70, availability: "high" },
    ],
    average_price: 130,
  },
  {
    name: "Warfarin 5mg",
    generic_name: "Warfarin",
    category: "Anticoagulant",
    shortage_risk: 0.75,
    risk_factors: [
      "narrow_therapeutic_index",
      "monitoring_requirements",
      "single_api_supplier",
    ],
    alternatives: [
      { name: "Rivaroxaban 20mg", price: 500, availability: "low" },
      { name: "Apixaban 5mg", price: 550, availability: "low" },
    ],
    average_price: 80,
  },
  {
    name: "Levothyroxine 100mcg",
    generic_name: "Levothyroxine",
    category: "Thyroid",
    shortage_risk: 0.5,
    risk_factors: [
      "bioequivalence_issues",
      "high_prevalence_of_thyroid_disorders",
    ],
    alternatives: [
      { name: "Liothyronine 25mcg", price: 150, availability: "medium" },
    ],
    average_price: 45,
  },
  {
    name: "Prednisone 10mg",
    generic_name: "Prednisone",
    category: "Corticosteroid",
    shortage_risk: 0.48,
    risk_factors: ["broad_applications", "raw_material_price_volatility"],
    alternatives: [
      { name: "Methylprednisolone 8mg", price: 90, availability: "high" },
      { name: "Dexamethasone 4mg", price: 60, availability: "high" },
    ],
    average_price: 50,
  },
  {
    name: "Furosemide 40mg",
    generic_name: "Furosemide",
    category: "Diuretic",
    shortage_risk: 0.33,
    risk_factors: ["aging_population_demand"],
    alternatives: [
      { name: "Torsemide 20mg", price: 55, availability: "high" },
      { name: "Hydrochlorothiazide 25mg", price: 35, availability: "high" },
    ],
    average_price: 30,
  },
  {
    name: "Escitalopram 10mg",
    generic_name: "Escitalopram",
    category: "Antidepressant",
    shortage_risk: 0.4,
    risk_factors: ["stigma_reduction_increasing_demand"],
    alternatives: [
      { name: "Sertraline 50mg", price: 100, availability: "high" },
      { name: "Citalopram 20mg", price: 85, availability: "high" },
    ],
    average_price: 120,
  },
  {
    name: "Rosuvastatin 10mg",
    generic_name: "Rosuvastatin",
    category: "Cholesterol",
    shortage_risk: 0.52,
    risk_factors: ["aggressive_marketing_by_brand", "high_demand"],
    alternatives: [
      { name: "Atorvastatin 20mg", price: 90, availability: "high" },
      { name: "Simvastatin 40mg", price: 85, availability: "high" },
    ],
    average_price: 100,
  },
  {
    name: "Tramadol 50mg",
    generic_name: "Tramadol",
    category: "Pain Relief",
    shortage_risk: 0.6,
    risk_factors: [
      "abuse_potential_leading_to_regulation",
      "supply_disruptions",
    ],
    alternatives: [
      { name: "Tapentadol 50mg", price: 150, availability: "medium" },
      { name: "Codeine 30mg", price: 120, availability: "medium" },
    ],
    average_price: 70,
  },
  {
    name: "Clopidogrel 75mg",
    generic_name: "Clopidogrel",
    category: "Antiplatelet",
    shortage_risk: 0.45,
    risk_factors: ["generic_availability", "high_use_in_cardiac_patients"],
    alternatives: [
      { name: "Prasugrel 10mg", price: 200, availability: "low" },
      { name: "Ticagrelor 90mg", price: 250, availability: "low" },
    ],
    average_price: 65,
  },
  {
    name: "Pantoprazole 40mg",
    generic_name: "Pantoprazole",
    category: "Acid Reflux",
    shortage_risk: 0.22,
    risk_factors: ["multiple_otc_options", "stable_demand"],
    alternatives: [
      { name: "Omeprazole 20mg", price: 60, availability: "high" },
      { name: "Esomeprazole 20mg", price: 80, availability: "high" },
    ],
    average_price: 70,
  },
  {
    name: "Doxycycline 100mg",
    generic_name: "Doxycycline",
    category: "Antibiotic",
    shortage_risk: 0.69,
    risk_factors: [
      "versatile_use_in_infections",
      "raw_material_sourcing_from_single_region",
    ],
    alternatives: [
      { name: "Minocycline 100mg", price: 160, availability: "medium" },
      { name: "Tetracycline 250mg", price: 130, availability: "high" },
    ],
    average_price: 150,
  },
  {
    name: "Montelukast 10mg",
    generic_name: "Montelukast",
    category: "Asthma",
    shortage_risk: 0.3,
    risk_factors: ["seasonal_allergy_demand", "generic_competition"],
    alternatives: [
      { name: "Zafirlukast 20mg", price: 110, availability: "medium" },
      { name: "Fluticasone Nasal Spray", price: 150, availability: "high" },
    ],
    average_price: 80,
  },
  {
    name: "Insulin Glargine",
    generic_name: "Insulin Glargine",
    category: "Diabetes",
    shortage_risk: 0.82,
    risk_factors: [
      "complex_manufacturing_process",
      "cold_chain_logistics",
      "high_global_demand",
    ],
    alternatives: [
      { name: "Insulin Detemir", price: 1800, availability: "medium" },
      { name: "NPH Insulin", price: 500, availability: "high" },
    ],
    average_price: 1500,
  },
  {
    name: "Cephalexin 500mg",
    generic_name: "Cephalexin",
    category: "Antibiotic",
    shortage_risk: 0.4,
    risk_factors: ["broad_spectrum_use"],
    alternatives: [
      {
        name: "Amoxicillin-Clavulanate 625mg",
        price: 150,
        availability: "high",
      },
      { name: "Cefuroxime 500mg", price: 180, availability: "medium" },
    ],
    average_price: 120,
  },
  {
    name: "Metoprolol Succinate 50mg",
    generic_name: "Metoprolol",
    category: "Hypertension",
    shortage_risk: 0.38,
    risk_factors: ["extended_release_formulation_challenges"],
    alternatives: [
      { name: "Atenolol 50mg", price: 40, availability: "high" },
      { name: "Bisoprolol 5mg", price: 55, availability: "high" },
    ],
    average_price: 60,
  },
  {
    name: "Pregabalin 75mg",
    generic_name: "Pregabalin",
    category: "Neuropathic Pain",
    shortage_risk: 0.65,
    risk_factors: [
      "controlled_substance_regulations",
      "api_manufacturing_complexity",
    ],
    alternatives: [
      { name: "Gabapentin 300mg", price: 130, availability: "high" },
      { name: "Duloxetine 60mg", price: 300, availability: "medium" },
    ],
    average_price: 250,
  },
  {
    name: "Alprazolam 0.5mg",
    generic_name: "Alprazolam",
    category: "Anxiety",
    shortage_risk: 0.7,
    risk_factors: [
      "high_abuse_potential",
      "strict_prescribing_guidelines",
      "production_quotas",
    ],
    alternatives: [
      { name: "Lorazepam 1mg", price: 70, availability: "medium" },
      { name: "Diazepam 5mg", price: 60, availability: "high" },
    ],
    average_price: 50,
  },
  {
    name: "Fluconazole 150mg",
    generic_name: "Fluconazole",
    category: "Antifungal",
    shortage_risk: 0.45,
    risk_factors: [
      "single-dose_treatment_popularity",
      "occasional_outbreaks_of_fungal_infections",
    ],
    alternatives: [
      { name: "Itraconazole 100mg", price: 120, availability: "medium" },
      { name: "Ketoconazole Cream", price: 90, availability: "high" },
    ],
    average_price: 40,
  },
  {
    name: "Ondansetron 4mg",
    generic_name: "Ondansetron",
    category: "Nausea",
    shortage_risk: 0.35,
    risk_factors: ["chemotherapy_adjunct", "post-operative_use"],
    alternatives: [
      { name: "Granisetron 1mg", price: 150, availability: "medium" },
      { name: "Dimenhydrinate 50mg", price: 30, availability: "high" },
    ],
    average_price: 80,
  },
  {
    name: "Simvastatin 20mg",
    generic_name: "Simvastatin",
    category: "Cholesterol",
    shortage_risk: 0.42,
    risk_factors: ["older_statin_less_prescribed", "generic_competition"],
    alternatives: [
      { name: "Atorvastatin 10mg", price: 70, availability: "high" },
      { name: "Pravastatin 40mg", price: 75, availability: "high" },
    ],
    average_price: 80,
  },
  {
    name: "Carvedilol 12.5mg",
    generic_name: "Carvedilol",
    category: "Heart Failure",
    shortage_risk: 0.5,
    risk_factors: ["use_in_post-mi_patients", "manufacturing_complexity"],
    alternatives: [
      { name: "Metoprolol Succinate 50mg", price: 60, availability: "high" },
      { name: "Bisoprolol 5mg", price: 55, availability: "high" },
    ],
    average_price: 70,
  },
  {
    name: "Tamsulosin 0.4mg",
    generic_name: "Tamsulosin",
    category: "BPH",
    shortage_risk: 0.3,
    risk_factors: ["aging_male_population", "high_prevalence"],
    alternatives: [
      { name: "Finasteride 5mg", price: 100, availability: "high" },
      { name: "Alfuzosin 10mg", price: 90, availability: "medium" },
    ],
    average_price: 85,
  },
  {
    name: "Diazepam 5mg",
    generic_name: "Diazepam",
    category: "Anxiety",
    shortage_risk: 0.55,
    risk_factors: ["long_half-life", "abuse_potential"],
    alternatives: [
      { name: "Alprazolam 0.25mg", price: 40, availability: "high" },
      { name: "Clonazepam 0.5mg", price: 50, availability: "high" },
    ],
    average_price: 60,
  },
  {
    name: "Hydrochlorothiazide 25mg",
    generic_name: "Hydrochlorothiazide",
    category: "Diuretic",
    shortage_risk: 0.28,
    risk_factors: ["first-line_hypertension_treatment", "wide_use"],
    alternatives: [
      { name: "Chlorthalidone 25mg", price: 40, availability: "high" },
      { name: "Indapamide 1.5mg", price: 45, availability: "medium" },
    ],
    average_price: 35,
  },
  {
    name: "Duloxetine 60mg",
    generic_name: "Duloxetine",
    category: "Antidepressant",
    shortage_risk: 0.63,
    risk_factors: [
      "dual-indication_use_pain_depression",
      "patent_cliff_dynamics",
    ],
    alternatives: [
      { name: "Venlafaxine XR 75mg", price: 180, availability: "medium" },
      { name: "Milnacipran 50mg", price: 400, availability: "low" },
    ],
    average_price: 300,
  },
  {
    name: "Celecoxib 200mg",
    generic_name: "Celecoxib",
    category: "Pain Relief",
    shortage_risk: 0.55,
    risk_factors: ["cardiovascular_risk_concerns", "less_frequent_use"],
    alternatives: [
      { name: "Etoricoxib 90mg", price: 150, availability: "medium" },
      { name: "Naproxen 500mg", price: 60, availability: "high" },
    ],
    average_price: 120,
  },
  {
    name: "Ranitidine 150mg",
    generic_name: "Ranitidine",
    category: "Acid Reflux",
    shortage_risk: 0.9,
    risk_factors: ["major_global_recall_ndma", "manufacturing_halt"],
    alternatives: [
      { name: "Famotidine 20mg", price: 40, availability: "high" },
      { name: "Omeprazole 20mg", price: 60, availability: "high" },
    ],
    average_price: 50,
  },
  {
    name: "Quetiapine 100mg",
    generic_name: "Quetiapine",
    category: "Antipsychotic",
    shortage_risk: 0.6,
    risk_factors: [
      "multiple_indications",
      "sedative_properties_leading_to_off-label_use",
    ],
    alternatives: [
      { name: "Olanzapine 5mg", price: 150, availability: "medium" },
      { name: "Risperidone 2mg", price: 100, availability: "high" },
    ],
    average_price: 130,
  },
  {
    name: "Ezetimibe 10mg",
    generic_name: "Ezetimibe",
    category: "Cholesterol",
    shortage_risk: 0.35,
    risk_factors: ["add-on_therapy", "stable_demand"],
    alternatives: [
      { name: "Bempedoic Acid 180mg", price: 450, availability: "low" },
      { name: "Fenofibrate 145mg", price: 80, availability: "high" },
    ],
    average_price: 95,
  },
  {
    name: "Venlafaxine XR 75mg",
    generic_name: "Venlafaxine",
    category: "Antidepressant",
    shortage_risk: 0.58,
    risk_factors: ["discontinuation_syndrome", "formulation_complexity"],
    alternatives: [
      { name: "Duloxetine 60mg", price: 300, availability: "medium" },
      { name: "Desvenlafaxine 50mg", price: 250, availability: "medium" },
    ],
    average_price: 180,
  },
  {
    name: "Spironolactone 25mg",
    generic_name: "Spironolactone",
    category: "Diuretic",
    shortage_risk: 0.48,
    risk_factors: ["hormonal_side_effects", "use_in_acne_and_hirsutism"],
    alternatives: [
      { name: "Eplerenone 25mg", price: 200, availability: "low" },
      { name: "Amiloride 5mg", price: 40, availability: "high" },
    ],
    average_price: 55,
  },
  {
    name: "Naproxen 500mg",
    generic_name: "Naproxen",
    category: "Pain Relief",
    shortage_risk: 0.29,
    risk_factors: ["otc_and_prescription_strength", "stable_market"],
    alternatives: [
      { name: "Ibuprofen 600mg", price: 50, availability: "high" },
      { name: "Diclofenac 50mg", price: 70, availability: "high" },
    ],
    average_price: 60,
  },
  {
    name: "Allopurinol 100mg",
    generic_name: "Allopurinol",
    category: "Gout",
    shortage_risk: 0.32,
    risk_factors: ["long-term_prophylaxis", "increasing_prevalence_of_gout"],
    alternatives: [
      { name: "Febuxostat 40mg", price: 150, availability: "medium" },
      { name: "Colchicine 0.5mg", price: 80, availability: "high" },
    ],
    average_price: 45,
  },
  {
    name: "Risperidone 2mg",
    generic_name: "Risperidone",
    category: "Antipsychotic",
    shortage_risk: 0.53,
    risk_factors: ["side_effect_profile", "generic_availability"],
    alternatives: [
      { name: "Paliperidone 3mg", price: 300, availability: "low" },
      { name: "Aripiprazole 10mg", price: 250, availability: "medium" },
    ],
    average_price: 100,
  },
  {
    name: "Glimepiride 2mg",
    generic_name: "Glimepiride",
    category: "Diabetes",
    shortage_risk: 0.44,
    risk_factors: ["hypoglycemia_risk", "older_sulfonylurea"],
    alternatives: [
      { name: "Gliclazide MR 60mg", price: 100, availability: "high" },
      { name: "Glipizide 5mg", price: 80, availability: "high" },
    ],
    average_price: 70,
  },
];
