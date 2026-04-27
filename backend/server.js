require("dotenv").config();
const express = require('express')
const cors = require("cors");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const http = require("http");


const app = express ()
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: [
      process.env.CLIENT_URL,
      process.env.CLIENT_URL2
    ],
    methods: ["GET", "POST"] //  React frontend
  }
});





// sql stuff
const db = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
});
db.connect((err) => {
	if (err) throw err;
	console.log("Connected to MySQL");
});

io.on("connection", (socket) => {
//   console.log("User connected");









// 	//websocket forum messages action listener
//   socket.on("forum_send_message", (msg) => {
//     io.emit("forum_receive_message", msg);
//   });






  


});

//jwt secret key
const secretKey = process.env.JWT_SECRETKEY;
const refreshSecretKey = process.env.JWT_REFRESHSECRETKEY;





// actual backend stuff




//ARROW FUNCTIONS MUST BE DECLARED BEFORE USED
const checkUserTaken = async (username) => {
	const [rows] = await db.promise().query(
		"SELECT * FROM info WHERE user = ?",
		[username]
	);

	return rows.length > 0;	
};
//ARROW FUNCTIONS MUST BE DECLARED BEFORE USED
const checkEmailTaken = async (username) => {
	const [rows] = await db.promise().query(
		"SELECT * FROM info WHERE user = ?",
		[username]
	);

	return rows.length > 0;
};
//ARROW FUNCTIONS MUST BE DECLARED BEFORE USED
const getUserId = async (username) => {
	const [rows] = await db.promise().query(
    	"SELECT id FROM info WHERE user = ?",
    	[username]
  	);

  	if (rows.length === 0) {
    	return null; // user not found
  	}

  	return rows[0].id; 
};
//ARROW FUNCTIONS MUST BE DECLARED BEFORE USED
const verify = (req, res, next) => {

  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, secretKey, (err, payload) => {
      if (err) {
        return res.status(403).json("Token is not valid!");
      }

      req.user = payload;
      next();
    });
  } else {
    res.status(401).json("You are not authenticated!");
  }
};





app.post("/login", (req, res) => {
	const { User, Password } = req.body;

	const sql = "SELECT * FROM info WHERE user = ? AND password = ?;";

	const values = [User, Password];

	db.query(sql, values,async (err, result) => {
	if (err) {
		console.error('Error looking up user:', err);
		return res.status(500).json({ error: "Database error" });
	}
	if (result.length > 0) {
		console.log("User logged in:", values)
		const userId = await getUserId(User);

		if (!userId) {
		return res.json({ message: "User not found" });
		}

		const accessToken = generateAccessToken(User,userId);
		const refreshToken = generateRefreshToken(User,userId);

		const insertRefreshTokenIntoDatabase = `
				INSERT INTO refresh_tokens (user_id, token, expires_at, revoked)

				VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 30 DAY), FALSE)  `;

		db.query(insertRefreshTokenIntoDatabase, [userId, refreshToken], (err) => {
			if (err) {
				console.error(err);
				return res.status(500).json({ error: "Database error" });
			}
		});


		res.json(
			{ 
				message: "User logged in successfully!",
				accessToken,
				refreshToken,

			}
		);

	} else {
		res.status(401).json({ message: "Invalid username or password" });
	}

	});
})






app.post("/signup", async (req, res)  =>  {
	const { User, Password, Email } = req.body;

	if (!checkIfUserValid(User,res)) {
		return;
	}
	if (!checkIfPassValid(Password,res)) {
		return;
	}
	if (!checkIfEmailValid(Email,res)) {
		return;
	}

	if (await checkUserTaken(User)) {
		return res.json({ message: "Username already taken!" });
	}

	if (await checkEmailTaken(Email)) {
		return res.json({ message: "Email already taken!" });
	}


	const sql = "INSERT INTO info (user, password, email) VALUES (?, ?, ?)";
	const values = [User, Password,Email];
	db.query(sql, values, async (err, result) => {
		if (err) {
			console.error('Error inserting user:', err);

			return res.status(500).json({ error: "Database error" });
		}
		if (result.affectedRows > 0) {

			const userId = await getUserId(User);

			if (!userId) {
			return res.json({ message: "User not found" });
			}
			const accessToken = generateAccessToken(User,userId);
			const refreshToken = generateRefreshToken(User,userId);

			const insertRefreshTokenIntoDatabase = `
				INSERT INTO refresh_tokens (user_id, token, expires_at, revoked)

				VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 30 DAY), FALSE)  `;

			db.query(insertRefreshTokenIntoDatabase, [userId, refreshToken], (err) => {
				if (err) {
					console.error(err);
					return res.status(500).json({ error: "Database error" });
				}
			});

			console.log("User signed up:", User)
			res.json(
				{ 
					message: "User logged in successfully!",
					accessToken,
					refreshToken,

				}
			);

		}
	});
});



app.post("/api/refresh", (req, res) => {
  //take the refresh token from the user

	const authHeader = req.headers.authorization;
	const refreshToken = authHeader && authHeader.split(" ")[1];


	//looks in refresh_tokens database to see if it exists in database and hasnt expired
	const findSql = `
    SELECT * FROM refresh_tokens
    WHERE token = ? AND revoked = FALSE AND expires_at > NOW()  `;

	db.query(findSql, [refreshToken], (err, results) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ error: "Database error" });
		}

		if (results.length === 0) {
			return res.status(403).json({ error: "Refresh token is not found in database!" });
		}


		//verifies it for some reason
															// this user variable is the payload inside the token
		jwt.verify(refreshToken, refreshSecretKey, (err, user) => {
			if (err) {
				return res.status(403).json({ error: "Refresh token in database is not valid at all!" });
			}

			const newAccessToken = generateAccessToken(user.username,user.user_id);
			const newRefreshToken = generateRefreshToken(user.username,user.user_id);

			const updateSql = `
				UPDATE refresh_tokens
				SET revoked = TRUE
				WHERE token = ?`;

			db.query(updateSql, [refreshToken], (err) => {
				if (err) {
					console.error(err);
					return res.status(500).json({ error: "Database error while revoking past refreshToken" });
				}

				const insertSql = `
				INSERT INTO refresh_tokens (user_id, token, expires_at, revoked)

				VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 30 DAY), FALSE)  `;

				db.query(insertSql, [user.user_id, newRefreshToken], (err) => {
					if (err) {
						console.error(err);
						return res.status(500).json({ error: "Database error while inserting into refresh tokens" });
					}

					res.status(200).json({
						success:true,
						accessToken: newAccessToken,
						refreshToken: newRefreshToken,
					});
				});
			});
		});

	});
});
app.post("/api/logout", (req, res) => {
	const authHeader = req.headers.authorization;
	const refreshToken = authHeader && authHeader.split(" ")[1];

	jwt.verify(refreshToken, refreshSecretKey, (err, user) => {
			if (err) {
				return res.status(403).json({ error: "Error logging out: Invalid refresh token." });
			}

			const updateSql = `
				UPDATE refresh_tokens
				SET revoked = TRUE
				WHERE token = ?`;

			db.query(updateSql, [refreshToken], (err) => {
				if (err) {
					console.error(err);
					return res.status(500).json({ error: "Database error while revoking past refreshToken" });
				}
				return res.status(200).json({ success:true});

			});
		});
});


app.post("/api/sendforummessage", verify, (req, res) => {
	console.log("message received")
	const { message } = req.body;

    if (!message || !message.trim()) {
        return res.status(400).json({
            error: "Message cannot be empty"
        });
    }

    // assuming verify puts user info in req.user
    const sender_id = req.user.user_id;
	const sendername = req.user.username;

    const sql = `
      INSERT INTO forum_messages
      (sender_id, message_text)
      VALUES (?, ?)
    `;

    db.query(sql,[sender_id, message],(err, result) => {

        if (err) {
          console.error(err);
          return res.status(500).json({
            error: "Database error"
          });
        }

        
		const newMessage = {
			id: result.insertId,
			message_text: message,
			sender_name: sendername,
			sent_at: Date.now()
		};

		io.emit("forum_receive_message", newMessage);

		res.json({
			success: true,
			message: newMessage
		});
      }
    );

});
app.get("/api/users/getmyuserid", verify, (req, res) => {
	const user = req.user.user_id
  	res.json({user_id:user});
});

app.get("/api/users/getmyusername", verify, (req, res) => {
	const user = req.user.username
  	res.json({username:user});
});
app.get("/api/getforummessages", verify, (req, res) => {

	const getMessages = `
		SELECT *
		FROM (
			SELECT
				forum_messages.id,
				forum_messages.message_text,
				forum_messages.sent_at,
				info.User AS sender_name
			FROM forum_messages
			JOIN info
			ON forum_messages.sender_id = info.id
			ORDER BY forum_messages.sent_at DESC
			LIMIT 100
		) AS recent
		ORDER BY sent_at ASC;
		`;
	db.query(getMessages, (err,msgs) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ error: "Database error while getting forum messages." });
		}
		res.json({messages:msgs})
	});
});





const generateAccessToken = (user,user_id) => {
	console.log(`Created accessToken for ${user} with userId: ${user_id}`);

	return jwt.sign(
			{ //payload
				user_id:user_id,
				username:user,
			},
			secretKey,
			{
				expiresIn: "60s",
			}
		);
};

const generateRefreshToken = (user,user_id) => {
	console.log(`Created refreshToken for ${user} with userId: ${user_id}`);

	return jwt.sign(
			{ //payload
				user_id:user_id,
				username:user,
				jti: crypto.randomUUID(),
			},
			refreshSecretKey,
			{
				expiresIn: "30d",
			}
		);
};







function checkIfUserValid(User,res){
	if (!User || User.trim() === "") {
		if (res) res.json({ message: "Username is empty!"});

		return false;
	}
	if (/[^a-zA-Z0-9._]/.test(User)) {
		if (res) res.json({ message: "Username has invalid characters!" });

		return false;
	}
	if (User.length < 3 || User.length > 20) {
		if (res) res.json({ message: "Username must be 3-20 characters!" });
		return false;
	}
	return true;
}
function checkIfPassValid(Password, res){
	if (!Password || Password.trim() === "") {
		if (res) res.json({ message: "Password is empty!"});
		return false;
	}
	if (/[^a-zA-Z0-9._%$#@!&*]/.test(Password)) {
		if (res) res.json({ message: "Password has invalid characters!" });
		return false;
	}
	if (Password.length < 3 || Password.length > 20) {
		if (res) res.json({ message: "Password must be 3-20 characters!" });
		return false;
	}
	return true;
}
function checkIfEmailValid(Email,res){
	if (!Email || Email.trim() === "") {
		if (res) res.json({ message: "Email is empty!"});
		return false;
	}
	if (!Email.includes("@")) {
		if (res) res.json({ message: "Email has invalid characters!" });
		return false;
	}
	return true;
}







server.listen(3000);


app.listen(3000, ()=> {
	console.log('The server is running on: Port 3000')
})

app.get('/', (req,res)=>{
	res.send("Hello World!")
})