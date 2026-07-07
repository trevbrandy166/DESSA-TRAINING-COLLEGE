// require("dotenv").config();
// const express = require("express");
// const fileUpload = require("express-fileupload");
// const path = require("path");
// const fs = require("fs");
// const { getDb, initDb } = require("./database");
// const { sendApprovalEmail, sendRejectionEmail } = require("./email");

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Initialize database
// initDb();

// // Create uploads directory
// const uploadsDir = path.join(__dirname, "public", "uploads");
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir, { recursive: true });
// }

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(
//   fileUpload({
//     limits: { fileSize: 5 * 1024 * 1024 },
//     abortOnLimit: true,
//     createParentPath: true,
//   }),
// );
// app.use(express.static(path.join(__dirname, "public")));

// // Helper: Generate registration number
// function generateRegNumber() {
//   const year = new Date().getFullYear();
//   const random = Math.floor(1000 + Math.random() * 9000);
//   return `DES${year}${random}`;
// }

// // ========== API ROUTES ==========

// // Get all programs
// app.get("/api/programs", (req, res) => {
//   const db = getDb();
//   db.all(
//     "SELECT * FROM programs WHERE is_active = 1 ORDER BY category, name",
//     [],
//     (err, rows) => {
//       if (err) {
//         res.status(500).json({ error: err.message });
//         return;
//       }
//       res.json(rows);
//     },
//   );
//   db.close();
// });

// // Get single program with details
// app.get("/api/program/:code", (req, res) => {
//   const code = req.params.code;
//   const db = getDb();

//   db.get(
//     `
//       SELECT p.*, pd.full_description, pd.syllabus, pd.entry_requirements,
//              pd.career_paths, pd.schedule, pd.next_intake
//       FROM programs p
//       LEFT JOIN program_details pd ON p.code = pd.program_code
//       WHERE p.code = ? AND p.is_active = 1
//     `,
//     [code],
//     (err, row) => {
//       if (err) {
//         res.status(500).json({ error: err.message });
//         return;
//       }
//       if (!row) {
//         res.status(404).json({ error: "Program not found" });
//         return;
//       }
//       res.json(row);
//     },
//   );
//   db.close();
// });

// // Submit inquiry (homepage)
// app.post("/api/inquiry", (req, res) => {
//   const { full_name, email, phone, program_interest, message } = req.body;

//   if (!full_name || !email || !phone) {
//     return res
//       .status(400)
//       .json({ error: "Full name, email, and phone are required." });
//   }

//   const db = getDb();
//   const sql = `INSERT INTO inquiries (full_name, email, phone, program_interest, message) VALUES (?, ?, ?, ?, ?)`;

//   db.run(
//     sql,
//     [full_name, email, phone, program_interest || "", message || ""],
//     function (err) {
//       if (err) {
//         res.status(500).json({ error: err.message });
//         return;
//       }
//       res.status(201).json({
//         success: true,
//         message: "Thank you! We will contact you within 24 hours.",
//         id: this.lastID,
//       });
//     },
//   );
//   db.close();
// });

// // Submit application (admissions page)
// app.post("/api/apply", (req, res) => {
//   const required = [
//     "first_name",
//     "last_name",
//     "email",
//     "phone",
//     "program_code",
//   ];
//   for (let field of required) {
//     if (!req.body[field]) {
//       return res.status(400).json({ error: `${field} is required` });
//     }
//   }

//   let idDocPath = null;
//   let photoPath = null;
//   let certPath = null;

//   const timestamp = Date.now();
//   const uploadDir = path.join(__dirname, "public", "uploads");

//   if (req.files && req.files.id_document) {
//     const file = req.files.id_document;
//     const filename = `id_${timestamp}_${file.name}`;
//     file.mv(path.join(uploadDir, filename));
//     idDocPath = `/uploads/${filename}`;
//   }

//   if (req.files && req.files.passport_photo) {
//     const file = req.files.passport_photo;
//     const filename = `photo_${timestamp}_${file.name}`;
//     file.mv(path.join(uploadDir, filename));
//     photoPath = `/uploads/${filename}`;
//   }

//   if (req.files && req.files.certificate) {
//     const file = req.files.certificate;
//     const filename = `cert_${timestamp}_${file.name}`;
//     file.mv(path.join(uploadDir, filename));
//     certPath = `/uploads/${filename}`;
//   }

//   const db = getDb();
//   const sql = `
//     INSERT INTO applications (
//       first_name, last_name, email, phone, date_of_birth, gender,
//       nationality, id_number, program_code, study_mode, education_level,
//       institution, year_completed, emergency_name, emergency_phone,
//       emergency_relation, id_document_path, photo_path, certificate_path
//     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//   `;

//   const values = [
//     req.body.first_name,
//     req.body.last_name,
//     req.body.email,
//     req.body.phone,
//     req.body.date_of_birth || null,
//     req.body.gender || null,
//     req.body.nationality || null,
//     req.body.id_number || null,
//     req.body.program_code,
//     req.body.study_mode || "both",
//     req.body.education_level || null,
//     req.body.institution || null,
//     req.body.year_completed || null,
//     req.body.emergency_name || null,
//     req.body.emergency_phone || null,
//     req.body.emergency_relation || null,
//     idDocPath,
//     photoPath,
//     certPath,
//   ];

//   db.run(sql, values, function (err) {
//     if (err) {
//       console.error("Database error:", err);
//       res.status(500).json({ error: "Failed to save application" });
//       return;
//     }
//     res.status(201).json({
//       success: true,
//       message:
//         "Application submitted successfully! We will contact you within 48 hours.",
//       applicationId: this.lastID,
//     });
//   });
//   db.close();
// });

// // ========== ADMIN API ROUTES ==========

// // Get all applications
// app.get("/api/admin/applications", (req, res) => {
//   const adminKey = req.headers["x-admin-key"];

//   if (adminKey !== process.env.ADMIN_KEY) {
//     return res.status(403).json({ error: "Unauthorized" });
//   }

//   const db = getDb();
//   db.all(
//     `
//       SELECT a.*, p.name as program_name
//       FROM applications a
//       LEFT JOIN programs p ON a.program_code = p.code
//       ORDER BY a.submitted_at DESC
//     `,
//     [],
//     (err, rows) => {
//       if (err) {
//         res.status(500).json({ error: err.message });
//         return;
//       }
//       res.json(rows);
//     },
//   );
//   db.close();
// });

// // Approve application & assign registration number + send email
// app.post("/api/admin/assign-reg", async (req, res) => {
//   const { application_id, admin_key } = req.body;

//   if (admin_key !== process.env.ADMIN_KEY) {
//     return res.status(403).json({ error: "Unauthorized" });
//   }

//   const regNumber = generateRegNumber();
//   const db = getDb();

//   db.get(
//     "SELECT * FROM applications WHERE id = ?",
//     [application_id],
//     async (err, app) => {
//       if (err || !app) {
//         res.status(404).json({ error: "Application not found" });
//         db.close();
//         return;
//       }

//       db.run(
//         "UPDATE applications SET reg_number = ?, status = ? WHERE id = ?",
//         [regNumber, "approved", application_id],
//         async function (err) {
//           if (err) {
//             res.status(500).json({ error: err.message });
//             db.close();
//             return;
//           }

//           // Get program name
//           db.get(
//             "SELECT name FROM programs WHERE code = ?",
//             [app.program_code],
//             async (err, program) => {
//               const programName = program ? program.name : app.program_code;

//               // Send approval email with Reg Number + payment instructions
//               const emailSent = await sendApprovalEmail(
//                 app.email,
//                 app.first_name,
//                 regNumber,
//                 programName,
//               );

//               res.json({
//                 success: true,
//                 regNumber: regNumber,
//                 message: `Registration number ${regNumber} assigned successfully`,
//                 emailSent: emailSent,
//               });
//               db.close();
//             },
//           );
//         },
//       );
//     },
//   );
// });

// // Reject application with reason + send email
// app.post("/api/admin/reject", async (req, res) => {
//   const { application_id, reason, admin_key } = req.body;

//   if (admin_key !== process.env.ADMIN_KEY) {
//     return res.status(403).json({ error: "Unauthorized" });
//   }

//   const db = getDb();

//   db.get(
//     "SELECT * FROM applications WHERE id = ?",
//     [application_id],
//     async (err, app) => {
//       if (err || !app) {
//         res.status(404).json({ error: "Application not found" });
//         db.close();
//         return;
//       }

//       db.run(
//         "UPDATE applications SET status = ? WHERE id = ?",
//         ["rejected", application_id],
//         async function (err) {
//           if (err) {
//             res.status(500).json({ error: err.message });
//             db.close();
//             return;
//           }

//           // Send rejection email
//           const emailSent = await sendRejectionEmail(
//             app.email,
//             app.first_name,
//             reason,
//           );

//           res.json({
//             success: true,
//             message: "Application rejected and email sent",
//             emailSent: emailSent,
//           });
//           db.close();
//         },
//       );
//     },
//   );
// });

// // ========== PAGE ROUTES ==========

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "views", "index.html"));
// });

// app.get("/about", (req, res) => {
//   res.sendFile(path.join(__dirname, "views", "about.html"));
// });

// app.get("/program", (req, res) => {
//   res.sendFile(path.join(__dirname, "views", "program.html"));
// });

// app.get("/admissions", (req, res) => {
//   res.sendFile(path.join(__dirname, "views", "admissions.html"));
// });

// app.get("/admin", (req, res) => {
//   res.sendFile(path.join(__dirname, "views", "admin.html"));
// });

// // ========== START SERVER ==========

// app.listen(PORT, () => {
//   console.log(`Dessa College server running at http://localhost:${PORT}`);
// });

require("dotenv").config();
const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");
const fs = require("fs");
const { getDb, initDb } = require("./database");
const {
  sendApprovalEmail,
  sendRejectionEmail,
  sendInquiryNotification,
} = require("./email");

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize database
initDb();

// Create uploads directory
const uploadsDir = path.join(__dirname, "public", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 },
    abortOnLimit: true,
    createParentPath: true,
  }),
);
app.use(express.static(path.join(__dirname, "public")));

// Helper: Generate registration number
function generateRegNumber() {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `DES${year}${random}`;
}

// ========== API ROUTES ==========

// Get all programs
app.get("/api/programs", (req, res) => {
  const db = getDb();
  db.all(
    "SELECT * FROM programs WHERE is_active = 1 ORDER BY category, name",
    [],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    },
  );
  db.close();
});

// Get single program with details
app.get("/api/program/:code", (req, res) => {
  const code = req.params.code;
  const db = getDb();

  db.get(
    `
      SELECT p.*, pd.full_description, pd.syllabus, pd.entry_requirements, 
             pd.career_paths, pd.schedule, pd.next_intake
      FROM programs p
      LEFT JOIN program_details pd ON p.code = pd.program_code
      WHERE p.code = ? AND p.is_active = 1
    `,
    [code],
    (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (!row) {
        res.status(404).json({ error: "Program not found" });
        return;
      }
      res.json(row);
    },
  );
  db.close();
});

// Submit inquiry (homepage) — now also sends email notification
app.post("/api/inquiry", async (req, res) => {
  const { full_name, email, phone, program_interest, message } = req.body;

  if (!full_name || !email || !phone) {
    return res
      .status(400)
      .json({ error: "Full name, email, and phone are required." });
  }

  const db = getDb();
  const sql = `INSERT INTO inquiries (full_name, email, phone, program_interest, message) VALUES (?, ?, ?, ?, ?)`;

  db.run(
    sql,
    [full_name, email, phone, program_interest || "", message || ""],
    async function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        db.close();
        return;
      }

      // Send email notification to school email
      const emailSent = await sendInquiryNotification({
        full_name,
        email,
        phone,
        program_interest,
        message,
      });

      res.status(201).json({
        success: true,
        message: "Thank you! We will contact you within 24 hours.",
        id: this.lastID,
        emailSent: emailSent,
      });
      db.close();
    },
  );
});

// Submit application (admissions page)
app.post("/api/apply", (req, res) => {
  const required = [
    "first_name",
    "last_name",
    "email",
    "phone",
    "program_code",
  ];
  for (let field of required) {
    if (!req.body[field]) {
      return res.status(400).json({ error: `${field} is required` });
    }
  }

  let idDocPath = null;
  let photoPath = null;
  let certPath = null;

  const timestamp = Date.now();
  const uploadDir = path.join(__dirname, "public", "uploads");

  if (req.files && req.files.id_document) {
    const file = req.files.id_document;
    const filename = `id_${timestamp}_${file.name}`;
    file.mv(path.join(uploadDir, filename));
    idDocPath = `/uploads/${filename}`;
  }

  if (req.files && req.files.passport_photo) {
    const file = req.files.passport_photo;
    const filename = `photo_${timestamp}_${file.name}`;
    file.mv(path.join(uploadDir, filename));
    photoPath = `/uploads/${filename}`;
  }

  if (req.files && req.files.certificate) {
    const file = req.files.certificate;
    const filename = `cert_${timestamp}_${file.name}`;
    file.mv(path.join(uploadDir, filename));
    certPath = `/uploads/${filename}`;
  }

  const db = getDb();
  const sql = `
    INSERT INTO applications (
      first_name, last_name, email, phone, date_of_birth, gender,
      nationality, id_number, program_code, study_mode, education_level,
      institution, year_completed, emergency_name, emergency_phone,
      emergency_relation, id_document_path, photo_path, certificate_path
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    req.body.first_name,
    req.body.last_name,
    req.body.email,
    req.body.phone,
    req.body.date_of_birth || null,
    req.body.gender || null,
    req.body.nationality || null,
    req.body.id_number || null,
    req.body.program_code,
    req.body.study_mode || "both",
    req.body.education_level || null,
    req.body.institution || null,
    req.body.year_completed || null,
    req.body.emergency_name || null,
    req.body.emergency_phone || null,
    req.body.emergency_relation || null,
    idDocPath,
    photoPath,
    certPath,
  ];

  db.run(sql, values, function (err) {
    if (err) {
      console.error("Database error:", err);
      res.status(500).json({ error: "Failed to save application" });
      return;
    }
    res.status(201).json({
      success: true,
      message:
        "Application submitted successfully! We will contact you within 48 hours.",
      applicationId: this.lastID,
    });
  });
  db.close();
});

// ========== ADMIN API ROUTES ==========

// Get all applications
app.get("/api/admin/applications", (req, res) => {
  const adminKey = req.headers["x-admin-key"];

  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  const db = getDb();
  db.all(
    `
      SELECT a.*, p.name as program_name 
      FROM applications a
      LEFT JOIN programs p ON a.program_code = p.code
      ORDER BY a.submitted_at DESC
    `,
    [],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    },
  );
  db.close();
});

// Approve application & assign registration number + send email
app.post("/api/admin/assign-reg", async (req, res) => {
  const { application_id, admin_key } = req.body;

  if (admin_key !== process.env.ADMIN_KEY) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  const regNumber = generateRegNumber();
  const db = getDb();

  db.get(
    "SELECT * FROM applications WHERE id = ?",
    [application_id],
    async (err, app) => {
      if (err || !app) {
        res.status(404).json({ error: "Application not found" });
        db.close();
        return;
      }

      db.run(
        "UPDATE applications SET reg_number = ?, status = ? WHERE id = ?",
        [regNumber, "approved", application_id],
        async function (err) {
          if (err) {
            res.status(500).json({ error: err.message });
            db.close();
            return;
          }

          // Get program name
          db.get(
            "SELECT name FROM programs WHERE code = ?",
            [app.program_code],
            async (err, program) => {
              const programName = program ? program.name : app.program_code;

              // Send approval email with Reg Number + payment instructions
              const emailSent = await sendApprovalEmail(
                app.email,
                app.first_name,
                regNumber,
                programName,
              );

              res.json({
                success: true,
                regNumber: regNumber,
                message: `Registration number ${regNumber} assigned successfully`,
                emailSent: emailSent,
              });
              db.close();
            },
          );
        },
      );
    },
  );
});

// Reject application with reason + send email
app.post("/api/admin/reject", async (req, res) => {
  const { application_id, reason, admin_key } = req.body;

  if (admin_key !== process.env.ADMIN_KEY) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  const db = getDb();

  db.get(
    "SELECT * FROM applications WHERE id = ?",
    [application_id],
    async (err, app) => {
      if (err || !app) {
        res.status(404).json({ error: "Application not found" });
        db.close();
        return;
      }

      db.run(
        "UPDATE applications SET status = ? WHERE id = ?",
        ["rejected", application_id],
        async function (err) {
          if (err) {
            res.status(500).json({ error: err.message });
            db.close();
            return;
          }

          // Send rejection email
          const emailSent = await sendRejectionEmail(
            app.email,
            app.first_name,
            reason,
          );

          res.json({
            success: true,
            message: "Application rejected and email sent",
            emailSent: emailSent,
          });
          db.close();
        },
      );
    },
  );
});

// ========== PAGE ROUTES ==========

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "about.html"));
});

app.get("/program", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "program.html"));
});

app.get("/admissions", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "admissions.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "admin.html"));
});

// ========== START SERVER ==========

app.listen(PORT, () => {
  console.log(`Dessa College server running at http://localhost:${PORT}`);
});
