# Step 6: Verify Database & Test Connection

Congratulations on getting everything connected and securely committed to Git! To officially wrap up Day 1 and verify everything is 100% functional, we need to test if your Express server can successfully **read** and **write** data in your MongoDB Atlas cloud database.

---

## 1. Create a Test Endpoint in `index.js`
Let's add a temporary route to your `apps/server/index.js` file. This route will create a new user (a **Write** operation) and then fetch all users (a **Read** operation) to verify that everything works correctly.

Open `apps/server/index.js` and add this code right above the `app.listen` block:

```javascript
const User = require('./models/User'); // Import the User model

// Temporary endpoint to verify MongoDB Read/Write
app.get('/test-db', async (req, res) => {
  try {
    // 1. Test Write: Create a dummy test user
    const uniqueEmail = `test-${Date.now()}@sprintsync.com`;
    const newTestUser = await User.create({
      email: uniqueEmail,
      passwordHash: 'test_hashed_password',
      profile: {
        firstName: 'Test',
        lastName: 'Connection'
      },
      auth: {
        provider: 'local',
        emailVerified: true
      }
    });

    // 2. Test Read: Find the user we just created
    const foundUser = await User.findOne({ email: uniqueEmail });

    res.json({
      message: '✅ Database Read/Write test successful!',
      writeResult: newTestUser,
      readResult: foundUser
    });
  } catch (error) {
    console.error('Test DB Error:', error);
    res.status(500).json({
      message: '❌ Database test failed',
      error: error.message
    });
  }
});
```

---

## 2. Start the Server and Test
1. Make sure your server is running. If not, start it in your terminal:
   ```bash
   node index.js
   ```
2. Open your web browser or Postman and navigate to:
   ```text
   http://localhost:5000/test-db
   ```
3. If everything is working perfectly, you should see a JSON response in your browser confirming a successful read and write operation with the test user data!

---

## 3. Git Workflow Summary (For Reference)
Now that your first commit is pushed, here is the quick standard cheat sheet of commands you should run whenever you want to commit your progress at the end of each day:

1. **Check what has changed:**
   ```bash
   git status
   ```
2. **Add all changes to staging:**
   ```bash
   git add .
   ```
3. **Commit your changes with a descriptive message:**
   ```bash
   git commit -m "feat: complete day 1 deliverables"
   ```
4. **Push the commit up to your GitHub repository:**
   ```bash
   git push origin main
   ```

You are officially finished with Day 1 deliverables! Great job setting up a solid, premium Monorepo backend infrastructure! 🚀
