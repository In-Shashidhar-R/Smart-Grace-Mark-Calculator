const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Sashidhar@04',
    database: 'sde_project_db'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

// API endpoint to add a person
app.post('/add-student', (req, res) => {
    const {
        firstName,
        lastName,
        phoneNumber,
        email,
        abcId,
        aadhaarNumber,
        gender,
        registerNumber,
        dob,
        batch,
        branch,
        address,
        fatherName,
        fatherContact,
        motherName,
        motherContact,
        guardianName,
        guardianContact,
        resident,
        username,
        password
    } = req.body;

    const sql = `INSERT INTO students 
    (first_name, last_name, phone_number, email, abc_id, aadhaar_number, gender, register_number, dob, batch, branch, address, father_name, father_contact, mother_name, mother_contact, guardian_name, guardian_contact, resident, username, password) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [
        firstName, lastName, phoneNumber, email, abcId, aadhaarNumber, gender, registerNumber, dob,
        batch, branch, address, fatherName, fatherContact, motherName, motherContact, guardianName, guardianContact,
        resident, username, password
    ], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            res.status(500).json({ error: 'Database error' });
        } else {
            res.status(200).json({ message: 'Person added successfully' });
        }
    });
});

app.post('/add-user', (req, res) => {
    const { username, password, name, role } = req.body;

    // Ensure required data is provided
    if (!username || !password || !name || !role) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    // SQL query to insert user data
    const sql = 'INSERT INTO user (username, password, name, role) VALUES (?, ?, ?, ?)';
    db.query(sql, [username, password, name, role], (err, result) => {
        if (err) {
            console.error('Error adding user credentials:', err);
            return res.status(500).json({ message: 'Error adding user credentials' });
        }
        res.status(200).json({ message: 'User credentials added successfully', userId: result.insertId });
    });
});


app.post('/add-faculty', (req, res) => {
    const {
        firstName,
        lastName,
        phoneNumber,
        email,
        gender,
        dob,
        address,
        majorsubject,
        degree,
        username,
        password
    } = req.body;

    const sql = `INSERT INTO faculty 
    (first_name, last_name, phone_number, email, gender, dob, address, major_subject, degree, username, password) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [
        firstName, lastName, phoneNumber, email, gender, dob, address, majorsubject, degree, username, password
    ], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            res.status(500).json({ error: 'Database error' });
        } else {
            res.status(200).json({ message: 'Faculty added successfully' });
        }
    });
});

app.post('/add-classadvisor', (req, res) => {
    const {
        firstName,
        lastName,
        phoneNumber,
        email,
        gender,
        dob,
        address,
        majorsubject,
        degree,
        branch,
        batch,
        username,
        password
    } = req.body;

    const sql = `INSERT INTO classadvisor 
    (first_name, last_name, phone_number, email, gender, dob, address, major_subject, degree, branch, batch, username, password) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [
        firstName, lastName, phoneNumber, email, gender, dob, address, majorsubject, degree, branch, batch, username, password
    ], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            res.status(500).json({ error: 'Database error' });
        } else {
            res.status(200).json({ message: 'Faculty added successfully' });
        }
    });
});

app.get('/faculty', (req, res) => {
    const query = `
        SELECT f.first_name 
        FROM faculty f
        LEFT JOIN faculty_courses fc ON f.first_name = fc.faculty_name
        WHERE fc.faculty_name IS NULL
    `;

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'No available faculty found' });
        }
        res.json(results);
    });
});


app.get('/get-courses', (req, res) => {
    const query = `
    SELECT c.course_name 
    FROM courses c
    WHERE NOT EXISTS (
        SELECT 1 FROM faculty_courses fc 
        WHERE FIND_IN_SET(c.course_name, fc.course_name) > 0
    )
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Database Query Error:", err); // Log the error
            return res.status(500).json({ message: 'Database error' });
        }

        if (results.length === 0) {
            console.log("No available courses found.");
            return res.status(404).json({ message: 'No available courses found' });
        } // Log the courses
        res.json(results);
    });
});


app.post('/save-faculty-courses', (req, res) => {
    const { faculty_name, courses } = req.body;

    if (!faculty_name || !courses) {
        return res.status(400).json({ message: 'Faculty and courses are required' });
    }

    const query = "INSERT INTO faculty_courses (faculty_name, course_name) VALUES (?, ?)";

    db.query(query, [faculty_name, courses], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        res.status(200).json({ message: 'Faculty and courses saved successfully' });
    });
});

app.get('/get-faculty-courses', (req, res) => {
    const sql = `SELECT * FROM faculty_courses`;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});

app.delete('/delete-faculty-course', (req, res) => {
    const { faculty_name, course_name } = req.query;

    if (!faculty_name || !course_name) {
        return res.status(400).json({ message: 'Faculty name and course name are required' });
    }

    const query = "DELETE FROM faculty_courses WHERE faculty_name = ? AND course_name = ?";

    db.query(query, [faculty_name, course_name], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'No matching faculty course found' });
        }
        res.status(200).json({ message: 'Faculty course deleted successfully' });
    });
});



app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('No empty field can be left');
    }

    const query = 'SELECT * FROM user WHERE username = ? AND password = ?';

    db.query(query, [username, password], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Server error');
        } // Log the results from the database query

        if (results.length > 0) {
            // Respond with the user data if found
            res.json(results[0]);
        } else {
            res.status(401).send('Invalid email or password');
        }
    });
});


// API to fetch courses for a faculty
app.get('/courses/:username', (req, res) => {
    const username = req.params.username;

    // Fetch faculty name from users table
    const facultyQuery = `SELECT name FROM user WHERE username = ?`;
    db.query(facultyQuery, [username], (err, facultyResult) => {
        if (err) return res.status(500).json({ error: err.message });

        if (facultyResult.length > 0) {
            const facultyName = facultyResult[0].name;

            // Fetch courses associated with this faculty
            const courseQuery = `SELECT course_name FROM faculty_courses WHERE faculty_name = ?`;
            db.query(courseQuery, [facultyName], (err, courseResult) => {
                if (err) return res.status(500).json({ error: err.message });

                res.json(courseResult);
            });
        } else {
            res.status(404).json({ message: 'Faculty not found' });
        }
    });
});

app.get('/get-students/:courseName', (req, res) => {
    const { courseName } = req.params;
    const query = `
        SELECT s.first_name, s.last_name, s.batch, s.branch, s.register_number, s.email, s.phone_number
        FROM students s
        JOIN subjects sc ON s.batch = sc.batch AND s.branch = sc.department 
        WHERE sc.course_name = ? 
    `;

    db.query(query, [courseName], (err, results) => {
        if (err) {
            console.error("Database Query Error:", err);
            return res.status(500).json({ message: 'Database error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'No students found for this course' });
        }
        res.json(results); // Return the student data
    });
});


// Endpoint to get marks for a student based on register number and course name
// Endpoint to get marks for a student based on register number and course name
app.get('/get-student-marks/:registerNumber/:courseName', (req, res) => {
    const { registerNumber, courseName } = req.params;

    const query = `SELECT marks FROM student_marks WHERE register_number = ? AND course_name = ?`;

    db.query(query, [registerNumber, courseName], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching marks' });
        }

        if (results.length > 0) {
            // If marks exist, return them
            res.json({ marks: results[0].marks });
        } else {
            // If no marks found, return 0
            res.json({ marks: 0 });
        }
    });
});


app.post('/update-all-student-marks', (req, res) => {
    const updates = req.body; // Array of student mark updates

    // Loop through each update and update the database
    const promises = updates.map((update) => {
        return new Promise((resolve, reject) => {
            const { register_number, course_name, marks } = update;

            // First, check if the record exists
            const checkQuery = `SELECT * FROM student_marks WHERE register_number = ? AND course_name = ?`;
            db.query(checkQuery, [register_number, course_name], (err, results) => {
                if (err) {
                    return reject(err);
                }

                if (results.length > 0) {
                    // Record exists, update it
                    const updateQuery = `UPDATE student_marks SET marks = ? WHERE register_number = ? AND course_name = ?`;
                    db.query(updateQuery, [marks, register_number, course_name], (err, updateResult) => {
                        if (err) {
                            return reject(err);
                        }
                        resolve(updateResult);
                    });
                } else {
                    // Record does not exist, insert it
                    const insertQuery = `INSERT INTO student_marks (register_number, course_name, marks) VALUES (?, ?, ?)`;
                    db.query(insertQuery, [register_number, course_name, marks], (err, insertResult) => {
                        if (err) {
                            return reject(err);
                        }
                        resolve(insertResult);
                    });
                }
            });
        });
    });

    // Wait for all promises to resolve
    Promise.all(promises)
        .then(() => {
            res.status(200).json({ message: 'Marks updated successfully' });
        })
        .catch((error) => {
            console.error('Error updating marks:', error);
            res.status(500).json({ message: 'Error updating marks' });
        });
});

app.post('/get-advisor-details', (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    // Query to fetch advisor details based on username
    const query = `
      SELECT branch, batch
      FROM classadvisor
      WHERE username = ?
    `;

    db.query(query, [username], (err, results) => {
        if (err) {
            console.error('Error fetching advisor details:', err);
            return res.status(500).json({ error: 'Failed to fetch advisor details' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Advisor not found' });
        }

        // Send the branch and batch as response
        const advisorDetails = results[0];
        res.json(advisorDetails);
    });
});

app.post('/get-students-by-advisor', (req, res) => {
    const { batch, branch } = req.body;

    if (!batch || !branch) {
        return res.status(400).json({ error: 'Branch and Batch are required' });
    }

    // Query to fetch students based on branch and batch
    const query = `
      SELECT register_number, first_name, last_name
      FROM students
      WHERE branch = ? AND batch = ?
    `;

    db.query(query, [branch, batch], (err, results) => {
        if (err) {
            console.error('Error fetching students:', err);
            return res.status(500).json({ error: 'Failed to fetch students' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'No students found' });
        }

        // Send the list of students as response
        res.json(results);
    });
});

app.post('/get-all-marks-by-register-number', (req, res) => {
    const { register_number } = req.body;
    const query = `
        SELECT student_marks.register_number, student_marks.course_name, student_marks.marks, courses.credits
        FROM student_marks
        JOIN courses ON student_marks.course_name = courses.course_name
        WHERE student_marks.register_number = ?;
    `;

    db.query(query, [register_number], (err, result) => {
        if (err) {
            console.error('Error fetching marks:', err);
            return res.status(500).json({ message: 'Error fetching marks' });
        }
        res.status(200).json(result);
    });
});

// Example Node.js/Express backend handler
app.post('/update-grace-marks', (req, res) => {
    const { username, graceMarksUsed } = req.body;

    if (!username || graceMarksUsed <= 0) {
        return res.status(400).json({ message: 'Invalid data' });
    }

    // SQL query to update grace marks table
    const query = `UPDATE grace_mark SET marks = marks - ? WHERE username = ?`;
    db.query(query, [graceMarksUsed, username], (err, result) => {
        if (err) {
            console.error('Error updating grace marks:', err);
            return res.status(500).json({ message: 'Error updating grace marks' });
        }

        res.json({ message: 'Grace marks updated successfully' });
    });
});


app.post('/get-course-credits', (req, res) => {
    db.query('SELECT course_name, credits FROM courses', (err, result) => {
        res.json(result);
    });
});

app.post('/update-student-marks', (req, res) => {
    const data = req.body.studentMarks;

    if (!data || data.length === 0) {
        return res.status(400).json({ error: 'No student marks provided' });
    }

    let updatedCount = 0;
    data.forEach((record, index) => {
        db.query(
            'UPDATE student_marks SET marks=? WHERE course_name=? AND register_number=?', [record.updated_marks, record.course_name, record.register_number],
            (err, result) => {
                if (err) {
                    console.error('Error updating marks:', err);
                    return res.status(500).json({ error: 'Database update failed' });
                }

                updatedCount++;
                if (updatedCount === data.length) {
                    console.log('All marks updated successfully');
                    res.status(200).json({ message: 'Marks updated successfully' });
                }
            }
        );
    });
});


// Endpoint to fetch all student usernames
app.get('/api/get-students-usernames', (req, res) => {
    const query = 'SELECT username FROM students'; // Assuming 'username' is the field containing usernames in the 'students' table
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching students usernames:', err);
            return res.status(500).json({ error: 'Failed to fetch students usernames' });
        }
        res.json(results.map(result => result.username)); // Extract usernames from results
    });
});

// Endpoint to fetch all faculty usernames
app.get('/api/get-faculties-usernames', (req, res) => {
    const query = 'SELECT username FROM faculty'; // Assuming 'username' is the field containing usernames in the 'faculty' table
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching faculty usernames:', err);
            return res.status(500).json({ error: 'Failed to fetch faculty usernames' });
        }
        res.json(results.map(result => result.username)); // Extract usernames from results
    });
});

// Endpoint to fetch all class advisor usernames
app.get('/api/get-advisors-usernames', (req, res) => {
    const query = 'SELECT username FROM classadvisor'; // Assuming 'username' is the field containing usernames in the 'classadvisor' table
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching advisors usernames:', err);
            return res.status(500).json({ error: 'Failed to fetch advisors usernames' });
        }
        res.json(results.map(result => result.username)); // Extract usernames from results
    });
});

// To get the student name 

app.post('/get-student-name', (req, res) => {
    const { username } = req.body;

    const query = 'SELECT name FROM user WHERE username = ?';
    db.query(query, [username], (err, results) => {
        if (err) {
            console.error('Error fetching student name:', err);
            return res.status(500).json({ error: 'Server error' });
        }

        if (results.length > 0) {
            const student = results[0];
            res.json({ name: `${student.name}` });
        } else {
            res.status(404).json({ error: 'Student not found' });
        }
    });
});

app.get('/api/get-user-details/:type/:username', (req, res) => {
    const { type, username } = req.params;
    let query = '';

    switch (type) {
        case 'Student':
            query = 'SELECT * FROM students WHERE username = ?';
            break;
        case 'Faculty':
            query = 'SELECT * FROM faculty WHERE username = ?';
            break;
        case 'Class Advisor':
            query = 'SELECT * FROM classadvisor WHERE username = ?';
            break;
        default:
            return res.status(400).json({ error: 'Invalid user type' });
    }

    db.query(query, [username], (err, results) => {
        if (err) {
            console.error('Error fetching user details:', err);
            return res.status(500).json({ error: 'Failed to fetch user details' });
        }
        if (results.length > 0) {
            res.json(results[0]); // Send back the first result
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    });
});


// Endpoint to update user details
app.put('/api/update-user/:type', (req, res) => {
    const { type } = req.params;
    const { id, first_name, last_name, phone_number, email, gender, dob, address, major_subject, degree, batch, branch, abc_id, aadhaar_number, register_number, father_name, father_contact, mother_name, mother_contact, guardian_name, guardian_contact, resident, username, password } = req.body;

    if (!id) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    let query = '';
    let values = [];

    switch (type) {
        case 'Faculty':
            // Query to update Faculty details
            query = `UPDATE faculty SET first_name = ?, last_name = ?, phone_number = ?, email = ?, gender = ?, dob = ?, address = ?, major_subject = ?, degree = ?, username = ?, password = ? WHERE id = ?`;
            values = [first_name, last_name, phone_number, email, gender, dob, address, major_subject, degree, username, password, id];
            break;
        case 'Student':
            // Query to update Student details
            query = `UPDATE students SET first_name = ?, last_name = ?, phone_number = ?, email = ?, abc_id = ?, aadhaar_number = ?, gender = ?, register_number = ?, dob = ?, batch = ?, branch = ?, address = ?, father_name = ?, father_contact = ?, mother_name = ?, mother_contact = ?, guardian_name = ?, guardian_contact = ?, resident = ?, username = ?, password = ? WHERE id = ?`;
            values = [first_name, last_name, phone_number, email, abc_id, aadhaar_number, gender, register_number, dob, batch, branch, address, father_name, father_contact, mother_name, mother_contact, guardian_name, guardian_contact, resident, username, password, id];
            break;
        case 'Class Advisor':
            // Query to update Class Advisor details
            query = `UPDATE classadvisor SET first_name = ?, last_name = ?, phone_number = ?, email = ?, gender = ?, dob = ?, address = ?, major_subject = ?, degree = ?, username = ?, password = ? WHERE id = ?`;
            values = [first_name, last_name, phone_number, email, gender, dob, address, major_subject, degree, username, password, id];
            break;
        default:
            return res.status(400).json({ error: 'Invalid user type' });
    }

    // Execute the query
    db.query(query, values, (err, results) => {
        if (err) {
            console.error('Error updating user details:', err);
            return res.status(500).json({ error: 'Failed to update user details' });
        }
        console.log("Update Results:", results);
        if (results.affectedRows > 0) {
            res.json({ message: 'User details updated successfully' });
        } else {
            res.status(404).json({ error: 'User not found or no changes made' });
        }
    });
});



// Endpoint to delete user
// Endpoint to delete user
app.delete('/api/delete-user/:type/:id', (req, res) => {
    const { type, id } = req.params;
    let query = '';

    switch (type) {
        case 'Student':
            query = 'DELETE FROM students WHERE id = ?';
            break;
        case 'Faculty':
            query = 'DELETE FROM faculty WHERE id = ?';
            break;
        case 'Class Advisor':
            query = 'DELETE FROM classadvisor WHERE id = ?';
            break;
        default:
            return res.status(400).json({ error: 'Invalid user type' });
    }

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error deleting user:', err);
            return res.status(500).json({ error: 'Failed to delete user' });
        }
        if (results.affectedRows > 0) {
            res.json({ message: 'User deleted successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    });
});


app.get('/api/user/:username', (req, res) => {
    const username = req.params.username;
    const query = `SELECT * FROM students WHERE username = ?`;

    db.query(query, [username], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.length > 0) {
            return res.json(results[0]); // Return the first matching user
        } else {
            return res.status(404).json({ error: 'User not found' });
        }
    });
});

app.put('/api/user/:username', (req, res) => {
    const username = req.params.username;
    const {
        first_name,
        last_name,
        email,
        phone_number,
        gender,
        register_number,
        dob,
        batch,
        branch,
        address,
        father_name,
        father_contact,
        mother_name,
        mother_contact,
        guardian_name,
        guardian_contact,
        resident,
        password
    } = req.body;

    // Prepare the SQL query to update user details
    const query = `
        UPDATE students 
        SET 
            first_name = ?, 
            last_name = ?, 
            email = ?, 
            phone_number = ?, 
            gender = ?, 
            register_number = ?, 
            dob = ?, 
            batch = ?, 
            branch = ?, 
            address = ?, 
            father_name = ?, 
            father_contact = ?, 
            mother_name = ?, 
            mother_contact = ?, 
            guardian_name = ?, 
            guardian_contact = ?, 
            resident = ?, 
            password = ? 
        WHERE username = ?
    `;

    const values = [
        first_name, last_name, email, phone_number, gender,
        register_number, dob, batch, branch, address, father_name,
        father_contact, mother_name, mother_contact, guardian_name,
        guardian_contact, resident, password, username
    ];

    // Execute the update query
    db.query(query, values, (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.affectedRows > 0) {
            return res.json({ message: 'User updated successfully' });
        } else {
            return res.status(404).json({ error: 'User not found' });
        }
    });
});

app.get('/api/faculty-profile', (req, res) => {
    const { username } = req.query; // Retrieve the username from the query parameter

    if (!username) {
        return res.status(400).json({ message: 'No username provided in the request' });
    }

    // Assuming you're using a MySQL database
    db.query('SELECT faculty_id, first_name, last_name, phone_number, email, gender, dob, address, major_subject, degree, username, password FROM faculty WHERE username = ?', [username], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching faculty data' });
        }
        if (result.length > 0) {
            res.json(result[0]);
        } else {
            res.status(404).json({ message: 'Faculty not found' });
        }
    });
});

app.put('/api/faculty-profile', (req, res) => {
    const updatedFacultyData = req.body;
    const { username } = updatedFacultyData; // Get username from the request body

    if (!username) {
        return res.status(400).json({ message: 'No username provided' });
    }

    db.query(
        'UPDATE faculty SET first_name = ?, last_name = ?, phone_number = ?, email = ?, gender = ?, dob = ?, address = ?, major_subject = ?, degree = ?, password = ? WHERE username = ?', [
            updatedFacultyData.first_name,
            updatedFacultyData.last_name,
            updatedFacultyData.phone_number,
            updatedFacultyData.email,
            updatedFacultyData.gender,
            updatedFacultyData.dob,
            updatedFacultyData.address,
            updatedFacultyData.major_subject,
            updatedFacultyData.degree,
            updatedFacultyData.password,
            username
        ],
        (err, result) => {
            if (err) {
                console.error("Database error:", err); // Log the error
                return res.status(500).json({ message: 'Error updating faculty data', error: err });
            }

            if (result.affectedRows > 0) {
                res.json({ message: 'Faculty updated successfully' });
            } else {
                res.status(404).json({ message: 'Faculty not found' });
            }
        }
    );
});




app.post('/api/achievements', (req, res) => {
    const {
        username,
        type,
        title,
        description,
        organization,
        position,
        participants,
        eventDate,
        sharepoint,
    } = req.body;

    // Set default values for missing columns
    const status = 'Pending'; // Set default value for status
    const feedback = ''; // Or set NULL if the column allows it

    const query = `INSERT INTO achievements (username, type, title, description, organization, position, participants, eventDate, status, feedback, sharepoint) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(query, [username, type, title, description, organization, position, participants, eventDate, status, feedback, sharepoint], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error inserting achievement');
        }
        res.status(200).json({
            message: 'Achievement added successfully',
            success: true
        });
    });
});


app.get('/api/viewprogress', (req, res) => {
    const username = req.query.username; // Get the username from the query parameter

    if (!username) {
        return res.status(400).send('Username is required');
    }

    // Use the username to filter the query
    const query = 'SELECT * FROM achievements WHERE username = ?';

    db.query(query, [username], (err, results) => {
        if (err) {
            console.error('Error fetching achievements:', err);
            return res.status(500).send('Error fetching achievements');
        }
        res.json(results);
    });
});


// API endpoint to fetch achievements based on advisor's username
app.get('/api/advisor-viewprogress', (req, res) => {
    const advisorUsername = req.query.username; // Get the username from query params

    if (!advisorUsername) {
        return res.status(400).json({ message: 'Username is required' });
    }

    // Query to fetch the batch and department from the 'class_advisor' table
    const advisorQuery = 'SELECT batch, branch FROM classadvisor WHERE username = ?';

    db.query(advisorQuery, [advisorUsername], (err, advisorResults) => {
        if (err) {
            console.error('Error fetching class advisor details:', err);
            return res.status(500).json({ message: 'Error fetching class advisor details' });
        }

        if (advisorResults.length === 0) {
            return res.status(404).json({ message: 'Advisor not found' });
        }

        const { batch, branch } = advisorResults[0]; // Get batch and department

        // Query to fetch students based on the batch and department from the 'students' table
        const studentsQuery = 'SELECT username FROM students WHERE batch = ? AND branch = ?';

        db.query(studentsQuery, [batch, branch], (err, studentResults) => {
            if (err) {
                console.error('Error fetching students:', err);
                return res.status(500).json({ message: 'Error fetching students' });
            }

            if (studentResults.length === 0) {
                return res.status(404).json({ message: 'No students found for this batch and department' });
            }

            // Extract student usernames
            const studentUsernames = studentResults.map(student => student.username);

            // Query to fetch achievements for these students
            const achievementsQuery = 'SELECT * FROM achievements WHERE username IN (?)';

            db.query(achievementsQuery, [studentUsernames], (err, achievementsResults) => {
                if (err) {
                    console.error('Error fetching achievements:', err);
                    return res.status(500).json({ message: 'Error fetching achievements' });
                }

                return res.json(achievementsResults); // Send the achievements data back
            });
        });
    });
});

app.post('/get-achievement-counts', async(req, res) => {
    const { usernames } = req.body;
    const query = `
        SELECT 
            status, COUNT(*) AS count 
        FROM achievements 
        WHERE username IN (?) 
        GROUP BY status
    `;

    db.query(query, [usernames], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        let counts = { Pending: 0, approved: 0, rejected: 0 };
        results.forEach(row => {
            if (row.status === 'Pending') counts.pending = row.count;
            if (row.status === 'approved') counts.approved = row.count;
            if (row.status === 'rejected') counts.rejected = row.count;
        });

        res.json({ counts });
    });
});




// Function to calculate grace marks based on type and position
function calculateGraceMarks(type, position, participants) {
    let graceMarks = 0;
    participants = participants || 1; // Ensure participants is at least 1

    switch (type) {
        case "Conference paper presentation":
            graceMarks = 10 / participants;
            break;

        case "Extracurricular activities":
        case "Club activities and involvement":
        case "Blood donation campaigns":
        case "Volunteering in social service events":
            graceMarks = 5 / participants;
            break;

        case "Sports events":
        case "Technical event participation":
            if (position === "first") graceMarks = 10;
            else if (position === "second") graceMarks = 7.5;
            else if (position === "third") graceMarks = 5;
            break;

        default:
            graceMarks = 0;
    }

    return parseFloat(graceMarks.toFixed(1)); // Round to 1 decimal place
}

app.put("/api/editAchievement", (req, res) => {
    const { id, type, title, description, organization, position, eventDate } = req.body;

    const updateQuery = `
        UPDATE achievements 
        SET type = ?, title = ?, description = ?, organization = ?, position = ?, eventDate = ?
        WHERE id = ?`;

    db.query(updateQuery, [type, title, description, organization, position, eventDate, appliedDate, id], (err, result) => {
        if (err) {
            console.error("Error updating achievement:", err);
            return res.status(500).json({ message: "Failed to update achievement" });
        }

        if (result.affectedRows > 0) {
            res.json({ message: "Achievement updated successfully!" });
        } else {
            res.status(404).json({ message: "Achievement not found" });
        }
    });
});


// Endpoint to update achievement and handle grace marks
app.put("/api/updateAchievement", (req, res) => {
    const { id, username, type, position, status, participants } = req.body;

    // Calculate grace marks
    const graceMarks = calculateGraceMarks(type, position, participants);
    console.log(`Calculated Grace Marks: ${graceMarks} for ${username}`);
    console.log(`Participants count: ${participants}`);

    // Update the achievement status and grace marks awarded
    const updateAchievementQuery = `UPDATE achievements SET status = ?, grace_marks_awarded = ? WHERE id = ?`;
    db.query(updateAchievementQuery, [status, status === "approved" ? graceMarks : 0, id], (err, result) => {
        if (err) {
            console.error("Error updating achievement:", err);
            return res.status(500).json({ message: "Failed to update achievement" });
        }

        if (status === "approved") {
            console.log("Achievement approved, updating grace marks...");

            // Check if user already has a grace mark entry
            const checkQuery = `SELECT * FROM grace_mark WHERE username = ?`;
            db.query(checkQuery, [username], (err, results) => {
                if (err) {
                    console.error("Error fetching grace marks:", err);
                    return res.status(500).json({ message: "Database error" });
                }

                if (results.length > 0) {
                    // Update existing record
                    const updateGraceMarkQuery = `UPDATE grace_mark SET marks = marks + ? WHERE username = ?`;
                    db.query(updateGraceMarkQuery, [graceMarks, username], (err, result) => {
                        if (err) {
                            console.error("Error updating grace marks:", err);
                            return res.status(500).json({ message: "Failed to update grace marks" });
                        }
                        console.log("Grace marks updated successfully:", result);
                        return res.json({ message: "Achievement and grace marks updated successfully!" });
                    });
                } else {
                    // Insert new record
                    const insertQuery = `INSERT INTO grace_mark (username, marks) VALUES (?, ?)`;
                    db.query(insertQuery, [username, graceMarks], (err, result) => {
                        if (err) {
                            console.error("Error inserting grace marks:", err);
                            return res.status(500).json({ message: "Failed to insert grace marks" });
                        }
                        console.log("Grace marks added successfully:", result);
                        return res.json({ message: "Achievement and grace marks added successfully!" });
                    });
                }
            });
        } else if (status === "rejected") {
            console.log("Achievement rejected, setting grace marks to 0...");

            // Ensure that marks do not go negative
            const updateGraceMarkQuery = `UPDATE grace_mark SET marks = marks - ? WHERE username = ? AND marks >= ?`;
            db.query(updateGraceMarkQuery, [graceMarks, username, graceMarks], (err, result) => {
                if (err) {
                    console.error("Error deducting grace marks:", err);
                    return res.status(500).json({ message: "Failed to update grace marks" });
                }
                console.log("Grace marks deducted successfully:", result);
                return res.json({ message: "Achievement updated and grace marks reset to 0!" });
            });
        } else {
            console.log("Achievement updated without grace mark changes");
            return res.json({ message: "Achievement updated without grace mark changes" });
        }
    });
});

// Add a course (check if it exists first)
app.post('/add-course', (req, res) => {
    const { courseName, credits } = req.body;

    console.log('Received course data:', req.body);

    const checkCourseQuery = 'SELECT * FROM courses WHERE course_name = ?';
    db.query(checkCourseQuery, [courseName], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }

        console.log('Courses in DB:', results); // Log the results from the database

        if (results.length > 0) {
            return res.status(400).json({ message: 'Course already exists' });
        }

        // Add the new course
        const query = 'INSERT INTO courses (course_name, credits) VALUES (?, ?)';
        db.query(query, [courseName, credits], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Database error', error: err });
            }
            res.json({ message: 'Course added successfully' });
        });
    });
});

app.post('/add-subject', (req, res) => {
    const { batch, courseName, credits, department } = req.body;

    console.log('Received subject data:', req.body);

    const checkCourseQuery = 'SELECT * FROM courses WHERE course_name = ?';
    db.query(checkCourseQuery, [courseName], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }

        console.log('Course check results:', results); // Log the results from the course query

        if (results.length === 0) {
            return res.status(400).json({ message: 'Course does not exist' });
        }

        // Add the subject if course exists
        const query = 'INSERT INTO subjects (batch, course_name, credits, department) VALUES (?, ?, ?, ?)';
        db.query(query, [batch, courseName, credits, department], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Database error', error: err });
            }
            res.json({ message: 'Subject added successfully' });
        });
    });
});




app.post('/get-student-by-register-number', (req, res) => {
    const { register_number } = req.body;

    db.query('SELECT username FROM students WHERE register_number = ?', [register_number], (err, result) => {
        if (err) {
            console.error('Error fetching student:', err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (result.length > 0) {
            res.status(200).json({ username: result[0].username });
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    });
});


app.post('/get-grace-marks-by-username', (req, res) => {
    const { user_id } = req.body;

    console.log('Fetching grace marks for user:', user_id); // Log the username (user_id)

    db.query('SELECT marks FROM grace_mark WHERE username = ?', [user_id], (err, result) => {
        if (err) {
            console.error('Error fetching grace marks:', err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (result.length > 0) {
            res.status(200).json({ marks: result[0].marks });
        } else {
            res.status(200).json({ marks: 0 }); // Default to 0 if no entry exists
        }
    });
});

app.post('/update-student-marks', (req, res) => {
    const { studentMarks } = req.body;

    if (!studentMarks || studentMarks.length === 0) {
        return res.status(400).json({ message: 'No student marks provided for update.' });
    }

    // Loop through each student mark entry and update it
    studentMarks.forEach(mark => {
        const { register_number, course_name, updated_marks } = mark;

        // SQL query to update marks for each course
        const query = `
        UPDATE student_marks
        SET marks = ?
        WHERE register_number = ? AND course_name = ?;
      `;

        db.query(query, [updated_marks, register_number, course_name], (err, result) => {
            if (err) {
                console.error('Error updating marks:', err);
                return res.status(500).json({ message: 'Error updating marks for student' });
            }
        });
    });

    // If all updates are successful
    return res.status(200).json({ message: 'Marks updated successfully' });
});

// Define GET route for fetching class advisor details by username
app.get('/classadvisor/:username', async(req, res) => {
    const { username } = req.params; // Get username from route parameters

    try {
        // MySQL query with the correct placeholder for parameters
        const query = 'SELECT * FROM classadvisor WHERE username = ?';

        // Use db.query with the correct parameterized query
        db.query(query, [username], (err, result) => {
            if (err) {
                console.error('Error retrieving class advisor:', err);
                return res.status(500).json({ message: 'Error retrieving data' });
            }

            // Check if the result has any rows
            if (result.length > 0) {
                res.status(200).json(result[0]); // Return the first result (since username is unique)
            } else {
                res.status(404).json({ message: 'Class Advisor not found' });
            }
        });
    } catch (err) {
        console.error('Unexpected error:', err);
        res.status(500).json({ message: 'Error retrieving data' });
    }
});


// Define PUT route for updating class advisor details
app.put('/classadvisor/:username', async(req, res) => {
    const { username } = req.params;
    const { first_name, last_name, phone_number, email, gender, dob, address, major_subject, degree, batch, branch } = req.body;

    try {
        const query = `
            UPDATE classadvisor 
            SET first_name = ?, last_name = ?, phone_number = ?, email = ?, gender = ?, dob = ?, 
                address = ?, major_subject = ?, degree = ?, batch = ?, branch = ?
            WHERE username = ?
        `;

        // Execute the query with the provided parameters
        db.query(query, [first_name, last_name, phone_number, email, gender, dob, address, major_subject, degree, batch, branch, username], (err, result) => {
            if (err) {
                console.error('Error updating class advisor:', err);
                return res.status(500).json({ message: 'Error updating data' });
            }

            // Check if any row was affected (indicating successful update)
            if (result.affectedRows > 0) {
                res.status(200).json({ message: 'Class Advisor updated successfully' });
            } else {
                res.status(404).json({ message: 'Class Advisor not found' });
            }
        });
    } catch (err) {
        console.error('Unexpected error:', err);
        res.status(500).json({ message: 'Error updating data' });
    }
});

app.get('/grace-mark/:username', (req, res) => {
    const classAdvisorUsername = req.params.username;

    const query = `
      SELECT gm.*, s.first_name, s.last_name, s.register_number
      FROM grace_mark gm
      JOIN students s ON gm.username = s.username
      WHERE s.batch = (SELECT batch FROM classadvisor WHERE username = ?)
      AND s.branch = (SELECT branch FROM classadvisor WHERE username = ?);
    `;

    db.query(query, [classAdvisorUsername, classAdvisorUsername], (err, results) => {
        if (err) {
            console.error('Error fetching grace marks:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

app.post('/log-activity', (req, res) => {
    const { username, role, login_time } = req.body;
    const loginTime = moment().format('YYYY-MM-DD HH:mm:ss');

    const query = "INSERT INTO activity_logs (username, role, login_time) VALUES (?, ?, ?)";
    db.query(query, [username, role, loginTime], (err, result) => {
        if (err) {
            console.error("Error logging activity:", err);
            return res.status(500).send("Error logging activity");
        }
        res.status(200).json({ message: "Login recorded successfully" });
    });
});

app.get('/get-activity-logs', (req, res) => {
    db.query('SELECT username, role, login_time FROM activity_logs ORDER BY login_time DESC', (err, results) => {
        if (err) {
            console.error("Error fetching logs:", err);
            res.status(500).json({ error: "Database error" });
        } else {
            res.json(results);
        }
    });
});

app.post('/submit-feedback', (req, res) => {
    const { username, responsivenessRating, interfaceRating, feedback } = req.body;

    if (!username || !feedback) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const query = `INSERT INTO feedback (username, responsiveness_rating, interface_rating, feedback) VALUES (?, ?, ?, ?)`;
    db.query(query, [username, responsivenessRating, interfaceRating, feedback], (err, result) => {
        if (err) {
            console.error('Error saving feedback:', err);
            res.status(500).json({ message: 'Error saving feedback' });
        } else {
            res.status(201).json({ message: 'Feedback submitted successfully' });
        }
    });
});

// Backend endpoint to retrieve feedback
app.get('/get-feedback', (req, res) => {
    const query = 'SELECT * FROM feedback';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error retrieving feedback:', err);
            return res.status(500).json({ message: 'Error retrieving feedback' });
        }

        res.status(200).json(results);
    });
});

app.put('/api/updateAchievement/:id', (req, res) => {
    const { id } = req.params;
    const { type, title, description, organization, position, eventDate } = req.body;

    // SQL query to update the achievement details (except status, grace_marks_awarded, and feedback)
    const query = `
      UPDATE achievements 
      SET 
        type = ?, 
        title = ?, 
        description = ?, 
        organization = ?, 
        position = ?, 
        eventDate = ?
      WHERE id = ?`;

    db.query(query, [type, title, description, organization, position, eventDate, id], (err, result) => {
        if (err) {
            console.error('Error updating achievement:', err);
            return res.status(500).json({ message: 'Error updating achievement' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Achievement not found' });
        }

        res.status(200).json({ message: 'Achievement updated successfully' });
    });
});

const otpStore = {};

// Nodemailer Configuration for Sending Emails

app.post('/auth/get-email', (req, res) => {
    const { username } = req.body;
    const tables = ['students', 'faculty', 'classadvisor']; // Tables to check

    let query = tables.map(table => `SELECT email FROM ${table} WHERE username = ?`).join(" UNION ");

    db.query(query, [username, username, username], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        if (result.length > 0) {
            const email = result[0].email;
            return res.json({ email });
        } else {
            return res.status(404).json({ message: 'Username not found!' });
        }
    });
});

/**
 * 2️⃣ Generate and Send OTP to Email
 */
// Set up transporter for Gmail
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Correct SMTP host for Gmail
    port: 587, // TLS port
    secure: false, // Use false for TLS (not SSL)
    auth: {
        user: 'mailtosasi02@gmail.com',
        pass: 'bken szbo vzou wcuy' // Use App Password
    }
});

app.post('/auth/send-otp', async(req, res) => {
    const { email } = req.body;
    console.log('Received email:', email); // Log email for debugging
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
    console.log('Using port:', transporter.options.port); // Log the port being used

    otpStore[email] = otp; // Store OTP in memory

    const mailOptions = {
        from: '"Smart Grace Mark Calculator" <mailtosasi02@gmail.com>', // Sender's email address
        to: email, // Recipient's email address
        subject: 'Your OTP for Password Reset', // Email subject
        text: `Your OTP for password reset is: ${otp}`, // Plain text body
        html: `<b>Your OTP for password reset is: ${otp}</b>`, // HTML body
    };

    try {
        // Send email using async/await
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info);
        return res.json({ message: 'OTP sent successfully!', email });
    } catch (err) {
        console.error('Error sending email:', err);
        return res.status(500).json({ error: err.message });
    }
});



/**
 * 3️⃣ Verify OTP
 */
app.post('/auth/verify-otp', (req, res) => {
    const { email, otp } = req.body;

    if (otpStore[email] && otpStore[email] == otp) {
        delete otpStore[email]; // Remove OTP after verification
        return res.json({ message: 'OTP verified successfully!' });
    } else {
        return res.status(400).json({ message: 'Invalid OTP!' });
    }
});

/**
 * 4️⃣ Reset Password
 */
app.post('/auth/reset-password', async(req, res) => {
    const { username, newPassword } = req.body;

    const tables = ['students', 'faculty', 'classadvisor']; // Tables to update password
    const queries = tables.map(table => {
        return new Promise((resolve, reject) => {
            const query = `UPDATE ${table} SET password = ? WHERE username = ?`;
            db.query(query, [newPassword, username], (err, result) => {
                if (err) {
                    return reject(err); // Reject on error
                }
                resolve(result); // Resolve if successful
            });
        });
    });

    // Add the query to update the user table (assuming 'user' table has 'username')
    const userUpdateQuery = new Promise((resolve, reject) => {
        const query = `UPDATE user SET password = ? WHERE username = ?`;
        db.query(query, [newPassword, username], (err, result) => {
            if (err) {
                return reject(err); // Reject on error
            }
            resolve(result); // Resolve if successful
        });
    });

    // Execute all queries in parallel
    Promise.all([...queries, userUpdateQuery])
        .then(() => {
            return res.json({ message: 'Password updated successfully!' });
        })
        .catch((err) => {
            console.error('Error updating password:', err);
            return res.status(500).json({ error: err.message });
        });
});

app.post('/api/send-achievement-email', (req, res) => {
    const { email, appliedDate, status, achievementTitle } = req.body;

    const mailOptions = {
        from: 'Smart Grace Mark Calculator" <mailtosasi02@gmail.com>',
        to: email,
        subject: 'Achievement Status Update',
        text: `Dear User, \n\nYour achievement titled "${achievementTitle}" was applied on ${appliedDate}. It has been ${status} by your class advisor.\n\nBest regards,\nYour Application`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log('Error sending email:', err);
            return res.status(500).send('Error sending email');
        }
        console.log('Email sent:', info.response);
        return res.status(200).send('Email sent successfully');
    });
});

app.post('/get-advisor-details-advisor-dashboard', async(req, res) => {
    const { username } = req.body;
    const query = 'SELECT batch, branch FROM classadvisor WHERE username = ?';

    db.query(query, [username], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ message: 'Advisor not found' });
        }
    });
});

app.post('/get-students-advisor-dashboard', async(req, res) => {
    const { batch, branch } = req.body;
    const query = 'SELECT username FROM students WHERE batch = ? AND branch = ?';

    db.query(query, [batch, branch], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        const totalStudents = results.length; // Count of students
        res.json({ students: results, totalStudents });
    });
});


app.post('/get-achievement-student-count', async(req, res) => {
    const { usernames } = req.body;

    if (!usernames || usernames.length === 0) {
        return res.json({ studentsWithAchievements: 0 });
    }

    const query = `SELECT COUNT(DISTINCT username) AS studentsWithAchievements FROM achievements WHERE username IN (?)`;

    db.query(query, [usernames], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json(results[0]);
    });
});

app.post('/get-student-achievements', async(req, res) => {
    const { username } = req.body;

    console.log('Received username:', username); // Print the received username in the backend console

    if (!username) {
        return res.status(400).json({ message: 'Username is required' });
    }

    // Example query
    const query = 'SELECT COUNT(*) AS submitted, COUNT(CASE WHEN status = "approved" THEN 1 END) AS approved, COUNT(CASE WHEN status = "rejected" THEN 1 END) AS rejected, COUNT(CASE WHEN status = "pending" THEN 1 END) AS pending FROM achievements WHERE username = ?';

    db.query(query, [username], (err, results) => {
        if (err) {
            console.error('Error fetching achievements:', err);
            return res.status(500).send('Error fetching achievements');
        }

        if (results.length > 0) {
            const counts = results[0]; // Assuming counts are returned in this shape
            res.json({ counts });
        } else {
            res.status(404).json({ message: 'No achievements found for this username' });
        }
    });
});


app.post('/get-student-grace-marks', async(req, res) => {
    const { username } = req.body;

    console.log('Received username for grace marks:', username); // Print the received username

    if (!username) {
        return res.status(400).json({ message: 'Username is required' });
    }

    // Example query to get grace marks from the 'gracemark' table
    const query = 'SELECT marks FROM grace_mark WHERE username = ?';

    db.query(query, [username], (err, results) => {
        if (err) {
            console.error('Error fetching grace marks:', err);
            return res.status(500).send('Error fetching grace marks');
        }

        if (results.length > 0) {
            const graceMarks = results[0].marks; // Assuming grace marks are in the 'grace_marks' column
            res.json({ graceMarks });
        } else {
            res.status(404).json({ message: 'Grace marks not found for this username' });
        }
    });
});

// Endpoint to get the faculty details, course name, and subjects count
app.post('/get-faculty-details', (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ message: 'Username is required' });
    }

    // Query to get faculty first name from the faculty table
    db.query('SELECT first_name FROM faculty WHERE username = ?', [username], (err, facultyResult) => {
        if (err) {
            console.error('Error fetching faculty details:', err);
            return res.status(500).send('Internal Server Error');
        }

        if (facultyResult.length === 0) {
            return res.status(404).json({ message: 'Faculty not found' });
        }

        const firstName = facultyResult[0].first_name;

        // Query to get course name from the faculty_courses table
        db.query('SELECT course_name FROM faculty_courses WHERE faculty_name = ?', [firstName], (err, courseResult) => {
            if (err) {
                console.error('Error fetching course details:', err);
                return res.status(500).send('Internal Server Error');
            }

            if (courseResult.length === 0) {
                return res.status(404).json({ message: 'Course not found' });
            }

            const courseName = courseResult[0].course_name; // Assuming course_name contains multiple subjects

            // Split the course_name into individual subjects
            const subjectsArray = courseName.split(',');

            // Trim whitespace from each subject (if any)
            const trimmedSubjectsArray = subjectsArray.map(subject => subject.trim());

            // Query to get subjects and count the number of students for each subject, batch, and department
            let subjectQuery = `
  SELECT s.course_name, s.batch, s.department, COUNT(st.id) AS student_count
  FROM subjects s
  LEFT JOIN students st ON st.batch = s.batch AND st.branch = s.department
  WHERE s.course_name IN (?)
  GROUP BY s.course_name, s.batch, s.department
`;

            db.query(subjectQuery, [trimmedSubjectsArray], (err, subjectResult) => {
                if (err) {
                    console.error('Error fetching subject details:', err);
                    return res.status(500).send('Internal Server Error');
                }

                return res.json({
                    firstName,
                    courseName,
                    subjects: subjectResult
                });
            });

        });
    });
});

app.get('/get-dashboard-details', (req, res) => {
    const query = `
      SELECT 
        (SELECT COUNT(*) FROM students) AS totalStudents,
        (SELECT COUNT(*) FROM faculty) AS totalFaculty,
        (SELECT COUNT(*) FROM classadvisor) AS totalClassAdvisors,
        (SELECT COUNT(DISTINCT branch) FROM students) AS totalDepartments
    `;

    db.query(query, (err, result) => {
        if (err) {
            console.error('Error fetching dashboard details:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.json(result[0]);
    });
});

app.get('/api/deadlines', (req, res) => {
    const query = 'SELECT * FROM deadline LIMIT 1'; // Get the first (or only) record from the table

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching deadline data:', err);
            return res.status(500).send('Internal Server Error');
        }

        res.json(results[0]); // Send the first record from the result as the response
    });
});

app.put('/api/deadlines', (req, res) => {
    const { type, deadline } = req.body;

    // Ensure 'type' and 'deadline' are provided
    if (!type || !deadline) {
        return res.status(400).json({ message: 'Missing deadline type or deadline value' });
    }

    // Update the deadline in the database
    const field = `${type}_submission_deadline`;

    const query = `UPDATE deadlines SET ${field} = ? WHERE id = 1`; // Assuming the table has a single row with id = 1
    db.query(query, [deadline], (err, results) => {
        if (err) {
            console.error('Error updating deadline:', err);
            return res.status(500).json({ message: 'Error updating deadline' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Deadline record not found' });
        }

        res.status(200).json({ message: `${type} deadline updated successfully!` });
    });
});

const moment = require('moment');

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});