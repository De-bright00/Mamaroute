// Curated maternal-health patient-education seed content.
// Sources: WHO Antenatal Care recommendations, NHS Pregnancy pages, CDC Pregnancy guidance.
// Content is paraphrased into short patient-facing Q&A; always ends with "see a professional".

export type SeedDoc = { question: string; answer: string; source: string; tags: string[] };

export const KNOWLEDGE_SEED: SeedDoc[] = [
  {
    question: "How often should I go for antenatal check-ups?",
    answer: "The WHO recommends at least 8 antenatal contacts during pregnancy: 1 in the first trimester (before 12 weeks), 2 in the second trimester (around 20 and 26 weeks), and 5 in the third trimester (30, 34, 36, 38, and 40 weeks). Attend every visit — early problems are much easier to treat. Ask your nearest primary health centre or midwife to book you in.",
    source: "WHO Antenatal Care Recommendations (2016)",
    tags: ["antenatal", "checkups", "schedule"],
  },
  {
    question: "What warning signs in pregnancy mean I should go to the hospital immediately?",
    answer: "Go to a hospital or call the 24/7 hotline immediately if you have: heavy vaginal bleeding, severe abdominal pain, severe headache with blurred vision, convulsions or fainting, high fever (above 38.5°C), your baby has stopped moving or is moving much less than usual, your waters break before 37 weeks, or fluid that is green or brown. These can be signs of pre-eclampsia, infection, placental abruption or preterm labour.",
    source: "WHO / NHS Pregnancy Warning Signs",
    tags: ["emergency", "danger-signs"],
  },
  {
    question: "What should I eat during pregnancy?",
    answer: "Eat a variety of foods each day: whole grains (rice, yam, plantain, wheat), protein (beans, eggs, fish, meat, groundnuts), plenty of fruits and dark green vegetables (ugu, spinach, ewedu), and dairy or fortified alternatives. Take iron-rich foods with vitamin C (orange, tomato) to help absorption. Drink about 2 litres of clean water daily. Take your antenatal iron and folic-acid tablets exactly as prescribed.",
    source: "WHO Nutrition in Pregnancy",
    tags: ["nutrition", "diet"],
  },
  {
    question: "Is mild swelling in my feet during pregnancy normal?",
    answer: "Mild swelling of the feet and ankles is common in later pregnancy, especially at the end of the day or in hot weather. Rest with your feet raised, avoid standing for long periods, and wear comfortable shoes. However, sudden swelling of the face or hands, or swelling with headache or blurred vision, can be a sign of pre-eclampsia — see a health worker the same day.",
    source: "NHS Common Pregnancy Symptoms",
    tags: ["symptoms", "swelling", "pre-eclampsia"],
  },
  {
    question: "When should I worry about contractions?",
    answer: "Practice (Braxton-Hicks) contractions are irregular, usually painless and stop when you rest — these are normal from mid-pregnancy. True labour contractions get stronger, longer, and closer together over time. Go to the hospital if: contractions before 37 weeks, contractions every 5 minutes for an hour, your waters break, or you have any bleeding along with contractions.",
    source: "NHS Labour Signs",
    tags: ["labour", "contractions"],
  },
  {
    question: "How much weight should I gain in pregnancy?",
    answer: "Healthy weight gain depends on your starting weight. On average: 11–16 kg for a woman of normal weight, less if you were overweight, more if you were underweight. Most weight gain happens in the second half of pregnancy. Don't try to lose weight while pregnant. Your midwife will monitor this at each visit.",
    source: "WHO Maternal Nutrition",
    tags: ["weight", "nutrition"],
  },
  {
    question: "Can I take medicine when I have malaria in pregnancy?",
    answer: "Malaria in pregnancy is dangerous for both mother and baby and must be treated quickly — but many antimalarials are unsafe in the first trimester. Do NOT self-medicate. Go to a clinic the same day for a proper blood test and prescription. Sleep under an insecticide-treated mosquito net every night and take intermittent preventive treatment (IPTp-SP) at your antenatal visits from the second trimester as recommended in Nigeria.",
    source: "WHO Malaria in Pregnancy / Nigeria FMoH",
    tags: ["malaria", "medication"],
  },
  {
    question: "How do I count my baby's kicks and when should I worry?",
    answer: "From about 28 weeks, get to know your baby's normal pattern of movement. There is no set number, but you should feel your baby move regularly through the day. If movements slow down, feel weaker, or you cannot feel them for several hours, drink something cold, lie on your left side and count. If you still don't feel normal movement within 2 hours, go to the hospital immediately — do not wait until morning.",
    source: "NHS Baby Movements",
    tags: ["fetal-movement", "third-trimester"],
  },
  {
    question: "What is pre-eclampsia and how do I recognise it?",
    answer: "Pre-eclampsia is high blood pressure that develops in pregnancy, usually after 20 weeks, and can be life-threatening. Warning signs: severe or persistent headache, blurred vision or flashing lights, pain just under the ribs, sudden swelling of face/hands/feet, or vomiting late in pregnancy. Any of these = go to the hospital the same day. Your BP and urine are checked at antenatal visits to catch it early.",
    source: "WHO / NHS Pre-eclampsia",
    tags: ["pre-eclampsia", "blood-pressure", "emergency"],
  },
  {
    question: "Is it safe to have sex during pregnancy?",
    answer: "For most women with a normal pregnancy, sex is safe throughout pregnancy. Avoid it if you have vaginal bleeding, your waters have broken, you have a history of preterm labour, or your doctor has told you to. Positions that avoid pressure on the belly are more comfortable later on. Tell your partner if anything hurts.",
    source: "NHS Sex in Pregnancy",
    tags: ["lifestyle", "sex"],
  },
  {
    question: "Which foods and drinks should I avoid in pregnancy?",
    answer: "Avoid: alcohol (no amount is safe), raw or undercooked meat, fish or eggs, unpasteurised milk and soft cheeses, liver and pâté (too much vitamin A), and shark/swordfish (high mercury). Limit caffeine to under 200 mg/day (about 2 mugs of instant coffee). Wash fruits and vegetables well. Avoid herbal preparations you're unsure about — ask your midwife first.",
    source: "NHS Foods to Avoid",
    tags: ["nutrition", "safety"],
  },
  {
    question: "What is postpartum haemorrhage and when should I get help after birth?",
    answer: "Postpartum haemorrhage means heavy bleeding after birth — one of the leading causes of maternal death in Nigeria. After delivery, seek urgent care if you: soak more than one pad per hour, pass large clots (bigger than a plum), feel dizzy or faint, have a fast heartbeat, or have severe abdominal pain. Also come back for foul-smelling discharge or fever — these are signs of infection.",
    source: "WHO Postpartum Care",
    tags: ["postpartum", "bleeding", "emergency"],
  },
  {
    question: "How do I start breastfeeding after delivery?",
    answer: "Start breastfeeding within the first hour of birth if possible — skin-to-skin contact helps. Feed on demand, day and night, at least 8–12 times in 24 hours. Give only breast milk (no water, no formula) for the first 6 months — this is called exclusive breastfeeding and protects the baby from infections. Ask a midwife for help with latch if feeding hurts.",
    source: "WHO Breastfeeding Recommendations",
    tags: ["breastfeeding", "newborn"],
  },
  {
    question: "What vaccines should I get during pregnancy?",
    answer: "In Nigeria, tetanus toxoid (TT) vaccination during pregnancy prevents neonatal tetanus — follow the schedule at your antenatal clinic. Where available, the seasonal flu vaccine and Tdap (tetanus, diphtheria, pertussis) are recommended in pregnancy. Do NOT get live vaccines (like MMR or yellow fever) during pregnancy unless a doctor advises. Ask at your antenatal visit which vaccines apply to you.",
    source: "WHO / Nigeria Immunisation Schedule",
    tags: ["vaccines", "immunisation"],
  },
  {
    question: "What is a birth plan and do I need one?",
    answer: "A birth plan is a short note about your wishes for labour and delivery: where you want to give birth, who you want with you, pain-relief preferences, and what happens if there's an emergency. Most importantly: identify the nearest hospital that can handle emergencies, know how you will get there day or night, save the emergency hotline (+234 704 585 5451), and keep a small bag ready from 36 weeks with clothes for you and baby, ID, and antenatal card.",
    source: "WHO Birth Preparedness",
    tags: ["birth-plan", "preparation"],
  },
  {
    question: "I am feeling very sad or hopeless after having my baby — is that normal?",
    answer: "Feeling tearful or overwhelmed in the first 2 weeks after birth is common ('baby blues'). But if sadness, hopelessness, anxiety, trouble bonding with your baby, or thoughts of harming yourself or the baby last longer than 2 weeks, this may be postpartum depression — a real medical condition that can be treated. Please talk to a health worker, midwife or trusted person as soon as possible. You are not alone and it is not your fault.",
    source: "WHO Maternal Mental Health",
    tags: ["mental-health", "postpartum"],
  },
  {
    question: "What is iron-deficiency anaemia in pregnancy and how is it prevented?",
    answer: "Anaemia (low blood) is common in pregnancy and increases the risk of bleeding and low-birth-weight babies. Prevent it by taking your daily iron + folic acid tablets from your antenatal clinic, eating iron-rich foods (beans, dark green vegetables, liver in moderation, meat/fish), and eating vitamin-C foods (orange, pepper, tomato) at the same meal. Signs to report: extreme tiredness, breathlessness, dizziness, pale palms or eyelids.",
    source: "WHO Iron and Folic Acid Supplementation",
    tags: ["anaemia", "iron", "nutrition"],
  },
  {
    question: "How can I prepare for a maternal emergency at home?",
    answer: "1) Know the danger signs (bleeding, severe headache, convulsions, no fetal movement, fever, waters broken with green fluid). 2) Save the 24/7 hotline: +234 704 585 5451. 3) Identify the nearest hospital with maternity services and a second backup. 4) Arrange transport in advance — a neighbour with a car, a taxi driver's number, or the community ambulance. 5) Keep money set aside for emergency transport. 6) Have your antenatal card ready to grab. Use the SOS button in this app to alert nearby hospitals immediately.",
    source: "MamaRoute Emergency Preparedness / WHO",
    tags: ["emergency", "preparation"],
  },
];
