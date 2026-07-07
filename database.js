// const sqlite3 = require("sqlite3").verbose();
// const path = require("path");

// const DB_PATH = path.join(__dirname, "dessa.db");

// function getDb() {
//   return new sqlite3.Database(DB_PATH, (err) => {
//     if (err) {
//       console.error("Error opening database:", err.message);
//     }
//   });
// }

// function initDb() {
//   const db = getDb();

//   db.serialize(() => {
//     // Programs table
//     db.run(`
//             CREATE TABLE IF NOT EXISTS programs (
//                 id INTEGER PRIMARY KEY AUTOINCREMENT,
//                 code TEXT UNIQUE NOT NULL,
//                 name TEXT NOT NULL,
//                 category TEXT NOT NULL,
//                 description TEXT,
//                 duration_months INTEGER,
//                 mode TEXT DEFAULT 'both',
//                 fee_kes INTEGER,
//                 image_url TEXT,
//                 is_active INTEGER DEFAULT 1,
//                 created_at DATETIME DEFAULT CURRENT_TIMESTAMP
//             )
//         `);

//     // Program details table
//     db.run(`
//             CREATE TABLE IF NOT EXISTS program_details (
//                 id INTEGER PRIMARY KEY AUTOINCREMENT,
//                 program_code TEXT NOT NULL,
//                 full_description TEXT,
//                 syllabus TEXT,
//                 entry_requirements TEXT,
//                 career_paths TEXT,
//                 schedule TEXT,
//                 next_intake TEXT,
//                 FOREIGN KEY (program_code) REFERENCES programs(code)
//             )
//         `);

//     // Inquiries table
//     db.run(`
//             CREATE TABLE IF NOT EXISTS inquiries (
//                 id INTEGER PRIMARY KEY AUTOINCREMENT,
//                 full_name TEXT NOT NULL,
//                 email TEXT NOT NULL,
//                 phone TEXT NOT NULL,
//                 program_interest TEXT,
//                 message TEXT,
//                 status TEXT DEFAULT 'new',
//                 created_at DATETIME DEFAULT CURRENT_TIMESTAMP
//             )
//         `);

//     // Applications table (updated with reg_number)
//     db.run(`
//             CREATE TABLE IF NOT EXISTS applications (
//                 id INTEGER PRIMARY KEY AUTOINCREMENT,
//                 first_name TEXT NOT NULL,
//                 last_name TEXT NOT NULL,
//                 email TEXT NOT NULL,
//                 phone TEXT NOT NULL,
//                 date_of_birth TEXT,
//                 gender TEXT,
//                 nationality TEXT,
//                 id_number TEXT,
//                 program_code TEXT NOT NULL,
//                 study_mode TEXT,
//                 education_level TEXT,
//                 institution TEXT,
//                 year_completed TEXT,
//                 emergency_name TEXT,
//                 emergency_phone TEXT,
//                 emergency_relation TEXT,
//                 id_document_path TEXT,
//                 photo_path TEXT,
//                 certificate_path TEXT,
//                 reg_number TEXT UNIQUE,
//                 status TEXT DEFAULT 'pending',
//                 submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
//             )
//         `);

//     // NEW: Users table (for student portal login)
//     db.run(`
//             CREATE TABLE IF NOT EXISTS users (
//                 id INTEGER PRIMARY KEY AUTOINCREMENT,
//                 reg_number TEXT UNIQUE NOT NULL,
//                 email TEXT NOT NULL,
//                 password_hash TEXT NOT NULL,
//                 role TEXT DEFAULT 'student',
//                 created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//                 FOREIGN KEY (reg_number) REFERENCES applications(reg_number)
//             )
//         `);

//     // NEW: Students table (enrollment details)
//     db.run(`
//             CREATE TABLE IF NOT EXISTS students (
//                 id INTEGER PRIMARY KEY AUTOINCREMENT,
//                 reg_number TEXT UNIQUE NOT NULL,
//                 application_id INTEGER,
//                 program_code TEXT,
//                 intake_date TEXT,
//                 expected_graduation TEXT,
//                 current_semester INTEGER DEFAULT 1,
//                 total_fees INTEGER,
//                 paid_fees INTEGER DEFAULT 0,
//                 balance INTEGER,
//                 status TEXT DEFAULT 'active',
//                 FOREIGN KEY (reg_number) REFERENCES users(reg_number),
//                 FOREIGN KEY (application_id) REFERENCES applications(id)
//             )
//         `);

//     // NEW: Fee payments table
//     db.run(`
//             CREATE TABLE IF NOT EXISTS fee_payments (
//                 id INTEGER PRIMARY KEY AUTOINCREMENT,
//                 reg_number TEXT NOT NULL,
//                 amount INTEGER NOT NULL,
//                 payment_method TEXT,
//                 transaction_ref TEXT,
//                 semester INTEGER,
//                 description TEXT,
//                 paid_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//                 FOREIGN KEY (reg_number) REFERENCES students(reg_number)
//             )
//         `);

//     // NEW: Academic records table
//     db.run(`
//             CREATE TABLE IF NOT EXISTS academic_records (
//                 id INTEGER PRIMARY KEY AUTOINCREMENT,
//                 reg_number TEXT NOT NULL,
//                 semester INTEGER NOT NULL,
//                 unit_code TEXT,
//                 unit_name TEXT,
//                 cat_marks REAL,
//                 exam_marks REAL,
//                 total_marks REAL,
//                 grade TEXT,
//                 FOREIGN KEY (reg_number) REFERENCES students(reg_number)
//             )
//         `);

//     // Check if programs exist
//     db.get("SELECT COUNT(*) as count FROM programs", (err, row) => {
//       if (err) {
//         console.error(err);
//         db.close();
//         return;
//       }
//       if (row.count === 0) {
//         insertSampleData(db);
//       } else {
//         db.close();
//       }
//     });
//   });
// }

// function insertSampleData(db) {
//   const programs = [
//     [
//       "CPA",
//       "Certified Public Accountant",
//       "accounting",
//       "Professional accounting qualification recognized globally. Covers financial reporting, auditing, taxation, and management accounting.",
//       18,
//       "both",
//       85000,
//       "/images/cpa.jpg",
//     ],
//     [
//       "CAMS",
//       "Certified Anti-Money Laundering Specialist",
//       "accounting",
//       "Global certification for professionals in anti-money laundering and financial crime detection.",
//       6,
//       "both",
//       45000,
//       "/images/cams.jpg",
//     ],
//     [
//       "ATD",
//       "Accounting Technicians Diploma",
//       "accounting",
//       "Foundation-level qualification for aspiring accounting technicians. Covers bookkeeping, financial accounting, and business law.",
//       12,
//       "both",
//       35000,
//       "/images/atd.jpg",
//     ],
//     [
//       "COMP-PKG",
//       "Computer Packages",
//       "computer",
//       "Practical computer skills including MS Office, internet, email, and basic programming. Perfect for beginners and professionals.",
//       3,
//       "both",
//       15000,
//       "/images/computer.jpg",
//     ],
//   ];

//   const insertProg = db.prepare(
//     "INSERT INTO programs (code, name, category, description, duration_months, mode, fee_kes, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
//   );
//   programs.forEach((p) => insertProg.run(p));
//   insertProg.finalize();

//   const details = [
//     [
//       "CPA",
//       "The Certified Public Accountant (CPA) qualification is the premier accounting credential in Kenya and across East Africa. It is administered by KASNEB and recognized globally by professional bodies including ACCA and CIMA.",
//       "Part I: Financial Accounting, Communication, Introduction to Law and Economics, Information Communication Technology\nPart II: Financial Management, Principles of Management, Business Law, Auditing and Assurance\nPart III: Advanced Financial Reporting, Advanced Auditing and Assurance, Advanced Taxation, Advanced Management Accounting\nPart IV: Strategic Management and Leadership, Advanced Public Financial Management, Advanced Financial Management, Advanced Taxation",
//       "KCSE C+ (or equivalent) with at least C+ in Mathematics and English, OR\nKASNEB Technician Diploma, OR\nDegree from recognized university",
//       "Chief Financial Officer, Audit Manager, Tax Consultant, Financial Controller, Internal Auditor, Forensic Accountant, Risk Manager",
//       "Weekday classes: Mon-Fri 6pm-9pm\nWeekend classes: Sat 8am-5pm\nOnline: Self-paced with live sessions",
//       "September 2026 Intake - Now Open",
//     ],

//     [
//       "CAMS",
//       "The Certified Anti-Money Laundering Specialist (CAMS) is the global gold standard in AML certifications. It equips professionals with the skills to detect, prevent, and report financial crimes.",
//       "Module 1: Risks and Methods of Money Laundering and Terrorist Financing\nModule 2: Compliance Standards for Anti-Money Laundering and Combating the Financing of Terrorism\nModule 3: Anti-Money Laundering Compliance Program\nModule 4: Conducting and Supporting the Investigation Process",
//       "Degree or professional qualification, OR\n3+ years experience in financial crime compliance, OR\nCurrent employment in AML/CFT role",
//       "AML Compliance Officer, Fraud Investigator, Financial Crime Analyst, Regulatory Compliance Manager, Risk Assessment Specialist, Sanctions Analyst",
//       "Intensive 6-week program\nWeekday evenings: Mon-Thu 6pm-9pm\nOnline option available",
//       "August 2026 Intake - Now Open",
//     ],

//     [
//       "ATD",
//       "The Accounting Technicians Diploma (ATD) provides a solid foundation in accounting principles and practices. It is the entry-level qualification for those aspiring to become professional accountants.",
//       "Level I: Business Mathematics, Introduction to Financial Accounting, Principles of Economics, Communication Skills\nLevel II: Financial Accounting, Principles of Management, Business Law, Principles of Public Finance and Taxation\nLevel III: Advanced Financial Accounting, Auditing and Assurance, Management Accounting, Public Finance and Taxation",
//       "KCSE C- (or equivalent), OR\nCertificate in relevant field, OR\nMature entry (23+ years with work experience)",
//       "Bookkeeper, Accounts Assistant, Tax Assistant, Audit Junior, Payroll Administrator, Credit Controller, Finance Assistant",
//       "Weekday classes: Mon-Fri 5pm-8pm\nSaturday classes: 8am-4pm\nOnline: Flexible schedule",
//       "September 2026 Intake - Now Open",
//     ],

//     [
//       "COMP-PKG",
//       "Our Computer Packages course provides comprehensive training in essential computer skills for the modern workplace. From basic operations to advanced applications, we prepare you for digital proficiency.",
//       "Module 1: Computer Fundamentals (Windows, File Management, Internet & Email)\nModule 2: Microsoft Word (Document Creation, Formatting, Mail Merge, Templates)\nModule 3: Microsoft Excel (Formulas, Functions, Charts, Pivot Tables, Data Analysis)\nModule 4: Microsoft PowerPoint (Presentations, Animations, Design Principles)\nModule 5: Advanced Packages (QuickBooks, Sage, Pastel, Graphic Design Basics)",
//       "No prior experience needed\nBasic reading and writing skills\nWillingness to learn",
//       "Office Administrator, Data Entry Clerk, Receptionist, Accounts Assistant, Customer Service Representative, Small Business Owner, Freelance Professional",
//       "Morning session: 9am-12pm\nAfternoon session: 2pm-5pm\nEvening session: 6pm-8pm\nSaturday intensive: 8am-4pm",
//       "Rolling intake - New classes every Monday",
//     ],
//   ];

//   const insertDet = db.prepare(
//     "INSERT INTO program_details (program_code, full_description, syllabus, entry_requirements, career_paths, schedule, next_intake) VALUES (?, ?, ?, ?, ?, ?, ?)",
//   );
//   details.forEach((d) => insertDet.run(d));
//   insertDet.finalize();

//   console.log("Sample programs and details inserted.");
//   db.close();
// }

// module.exports = { getDb, initDb };

const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const DB_PATH = path.join(__dirname, "dessa.db");

function getDb() {
  return new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
      console.error("Error opening database:", err.message);
    }
  });
}

function initDb() {
  const db = getDb();

  db.serialize(() => {
    // Programs table
    db.run(`
      CREATE TABLE IF NOT EXISTS programs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        duration_months INTEGER,
        mode TEXT DEFAULT 'both',
        fee_kes INTEGER,
        image_url TEXT,
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Program details table
    db.run(`
      CREATE TABLE IF NOT EXISTS program_details (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        program_code TEXT NOT NULL,
        full_description TEXT,
        syllabus TEXT,
        entry_requirements TEXT,
        career_paths TEXT,
        schedule TEXT,
        next_intake TEXT,
        FOREIGN KEY (program_code) REFERENCES programs(code)
      )
    `);

    // Inquiries table (homepage)
    db.run(`
      CREATE TABLE IF NOT EXISTS inquiries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        program_interest TEXT,
        message TEXT,
        status TEXT DEFAULT 'new',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Applications table (admissions) — with reg_number for approved students
    db.run(`
      CREATE TABLE IF NOT EXISTS applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        date_of_birth TEXT,
        gender TEXT,
        nationality TEXT,
        id_number TEXT,
        program_code TEXT NOT NULL,
        study_mode TEXT,
        education_level TEXT,
        institution TEXT,
        year_completed TEXT,
        emergency_name TEXT,
        emergency_phone TEXT,
        emergency_relation TEXT,
        id_document_path TEXT,
        photo_path TEXT,
        certificate_path TEXT,
        reg_number TEXT UNIQUE,
        status TEXT DEFAULT 'pending',
        submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Check if programs exist
    db.get("SELECT COUNT(*) as count FROM programs", (err, row) => {
      if (err) {
        console.error(err);
        db.close();
        return;
      }
      if (row.count === 0) {
        insertSampleData(db);
      } else {
        db.close();
      }
    });
  });
}

function insertSampleData(db) {
  const programs = [
    [
      "CPA",
      "Certified Public Accountant",
      "accounting",
      "Professional accounting qualification recognized globally. Covers financial reporting, auditing, taxation, and management accounting.",
      18,
      "both",
      45000,
      "/images/cpa.jpg",
    ],
    [
      "CAMS",
      "Certified Anti-Money Laundering Specialist",
      "accounting",
      "Global certification for professionals in anti-money laundering and financial crime detection.",
      6,
      "both",
      45000,
      "/images/cams.jpg",
    ],
    [
      "ATD",
      "Accounting Technicians Diploma",
      "accounting",
      "Foundation-level qualification for aspiring accounting technicians. Covers bookkeeping, financial accounting, and business law.",
      12,
      "both",
      35000,
      "/images/atd.jpg",
    ],
    [
      "COMP-PKG",
      "Computer Packages",
      "computer",
      "Practical computer skills including MS Office, internet, email, and basic programming. Perfect for beginners and professionals.",
      3,
      "both",
      6000,
      "/images/computer.jpg",
    ],
  ];

  const insertProg = db.prepare(
    "INSERT INTO programs (code, name, category, description, duration_months, mode, fee_kes, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
  );
  programs.forEach((p) => insertProg.run(p));
  insertProg.finalize();

  const details = [
    [
      "CPA",
      "The Certified Public Accountant (CPA) qualification is the premier accounting credential in Kenya and across East Africa. It is administered by KASNEB and recognized globally by professional bodies including ACCA and CIMA.",
      "Part I: Financial Accounting, Communication, Introduction to Law and Economics, Information Communication Technology\nPart II: Financial Management, Principles of Management, Business Law, Auditing and Assurance\nPart III: Advanced Financial Reporting, Advanced Auditing and Assurance, Advanced Taxation, Advanced Management Accounting\nPart IV: Strategic Management and Leadership, Advanced Public Financial Management, Advanced Financial Management, Advanced Taxation",
      "KCSE C+ (or equivalent) with at least C+ in Mathematics and English, OR\nKASNEB Technician Diploma, OR\nDegree from recognized university",
      "Chief Financial Officer, Audit Manager, Tax Consultant, Financial Controller, Internal Auditor, Forensic Accountant, Risk Manager",
      "Weekday classes: Mon-Fri 6pm-9pm\nWeekend classes: Sat 8am-5pm\nOnline: Self-paced with live sessions",
      "September 2026 Intake - Now Open",
    ],
    [
      "CAMS",
      "The Certified Anti-Money Laundering Specialist (CAMS) is the global gold standard in AML certifications. It equips professionals with the skills to detect, prevent, and report financial crimes.",
      "Module 1: Risks and Methods of Money Laundering and Terrorist Financing\nModule 2: Compliance Standards for Anti-Money Laundering and Combating the Financing of Terrorism\nModule 3: Anti-Money Laundering Compliance Program\nModule 4: Conducting and Supporting the Investigation Process",
      "Degree or professional qualification, OR\n3+ years experience in financial crime compliance, OR\nCurrent employment in AML/CFT role",
      "AML Compliance Officer, Fraud Investigator, Financial Crime Analyst, Regulatory Compliance Manager, Risk Assessment Specialist, Sanctions Analyst",
      "Intensive 6-week program\nWeekday evenings: Mon-Thu 6pm-9pm\nOnline option available",
      "August 2026 Intake - Now Open",
    ],
    [
      "ATD",
      "The Accounting Technicians Diploma (ATD) provides a solid foundation in accounting principles and practices. It is the entry-level qualification for those aspiring to become professional accountants.",
      "Level I: Business Mathematics, Introduction to Financial Accounting, Principles of Economics, Communication Skills\nLevel II: Financial Accounting, Principles of Management, Business Law, Principles of Public Finance and Taxation\nLevel III: Advanced Financial Accounting, Auditing and Assurance, Management Accounting, Public Finance and Taxation",
      "KCSE C- (or equivalent), OR\nCertificate in relevant field, OR\nMature entry (23+ years with work experience)",
      "Bookkeeper, Accounts Assistant, Tax Assistant, Audit Junior, Payroll Administrator, Credit Controller, Finance Assistant",
      "Weekday classes: Mon-Fri 5pm-8pm\nSaturday classes: 8am-4pm\nOnline: Flexible schedule",
      "September 2026 Intake - Now Open",
    ],
    [
      "COMP-PKG",
      "Our Computer Packages course provides comprehensive training in essential computer skills for the modern workplace. From basic operations to advanced applications, we prepare you for digital proficiency.",
      "Module 1: Computer Fundamentals (Windows, File Management, Internet & Email)\nModule 2: Microsoft Word (Document Creation, Formatting, Mail Merge, Templates)\nModule 3: Microsoft Excel (Formulas, Functions, Charts, Pivot Tables, Data Analysis)\nModule 4: Microsoft PowerPoint (Presentations, Animations, Design Principles)\nModule 5: Advanced Packages (QuickBooks, Sage, Pastel, Graphic Design Basics)",
      "No prior experience needed\nBasic reading and writing skills\nWillingness to learn",
      "Office Administrator, Data Entry Clerk, Receptionist, Accounts Assistant, Customer Service Representative, Small Business Owner, Freelance Professional",
      "Morning session: 9am-12pm\nAfternoon session: 2pm-5pm\nEvening session: 6pm-8pm\nSaturday intensive: 8am-4pm",
      "Rolling intake - New classes every Monday",
    ],
  ];

  const insertDet = db.prepare(
    "INSERT INTO program_details (program_code, full_description, syllabus, entry_requirements, career_paths, schedule, next_intake) VALUES (?, ?, ?, ?, ?, ?, ?)",
  );
  details.forEach((d) => insertDet.run(d));
  insertDet.finalize();

  console.log("Sample programs and details inserted.");
  db.close();
}

module.exports = { getDb, initDb };
