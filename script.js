// MESS PORTAL - DEMO JAVASCRIPT

// SAVE AND GET DATA

function getData(key, fallback) {
    try {
        const v = JSON.parse(localStorage.getItem(key));
        return v === null ? fallback : v;
    } catch (e) {
        return fallback;
    }
}

function saveData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

// DEFAULT SETTINGS

const page = location.pathname.split("/").pop() || "index.html";

const days = [
    "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday", "Sunday"
];

// WEEKLY MENU

const defaultMenu = {
    Monday: [
        "Paratha, Curd",
        "Dal, Rice, Roti, Sabzi",
        "Tea, Biscuits",
        "Paneer, Roti, Rice"
    ],

    Tuesday: [
        "Poha, Milk",
        "Rajma, Rice, Roti, Salad",
        "Samosa, Tea",
        "Dal, Roti, Mix Veg"
    ],

    Wednesday: [
        "Aloo Paratha, Curd",
        "Chole, Rice, Roti",
        "Tea, Biscuits",
        "Paneer, Roti, Rice"
    ],

    Thursday: [
        "Idli, Sambar",
        "Dal, Rice, Roti, Sabzi",
        "Tea, Namkeen",
        "Chana Dal, Roti, Rice"
    ],

    Friday: [
        "Sandwich, Milk",
        "Dal, Rice, Roti, Sabzi",
        "Pakora, Tea",
        "Mix Veg, Roti, Rice"
    ],

    Saturday: [
        "Chole Bhature",
        "Rajma, Rice, Roti, Salad",
        "Tea, Biscuits",
        "Dal Makhani, Roti, Rice"
    ],

    Sunday: [
        "Chole Puri",
        "Special Thali",
        "Juice, Snacks",
        "Paneer, Roti, Rice, Sweet"
    ]
};

let menu = getData("menu", defaultMenu);

if (!menu.Monday || menu.Monday.length !== 4) {
    menu = defaultMenu;
    saveData("menu", menu);
}

// MEAL PLANS

const plans = {
    all: {
        name: "Breakfast + Lunch + Dinner",
        price: 48000
    },

    breakfastDinner: {
        name: "Breakfast + Dinner",
        price: 42000
    },

    lunchDinner: {
        name: "Lunch + Dinner",
        price: 43000
    },

    // NEW PLAN 1
    allMealsWithSnacks: {
        name: "Breakfast + Lunch + Snacks + Dinner",
        price: 52000
    },

    // NEW PLAN 2
    breakfastLunchSnacks: {
        name: "Breakfast + Snacks + Lunch",
        price: 46000
    }
};

const mealPrices = {
    breakfast: 40,
    lunch: 70,
    dinner: 60
};

let currentUser = getData("currentUser", null);
let selectedPlan = "";
let rating = 0;

// DATE FUNCTIONS

function todayDate() {
    const d = new Date();

    return `${d.getFullYear()}-${String(
        d.getMonth() + 1
    ).padStart(2, "0")}-${String(
        d.getDate()
    ).padStart(2, "0")}`;
}

function addMonths(s, n) {
    const d = new Date(s + "T12:00:00");
    d.setMonth(d.getMonth() + n);
    return d.toISOString().slice(0, 10);
}

function displayDate(s) {
    return s
        ? new Date(s + "T12:00:00").toLocaleDateString("en-IN")
        : "—";
}

// LOGIN FUNCTION

function login(role) {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password || !role) {
        alert("Please enter email, password and role.");
        return;
    }

    const studentId = "SID" +
        email.toLowerCase()
        .replace(/[^a-z0-9]/g, "")
        .slice(0, 6)
        .toUpperCase()
        .padEnd(6, "0");

    saveData("currentUser", {
        email,
        name: email.split("@")[0],
        role,
        studentId
    });

    location.href =
        role === "student" ? "student.html" : "manager.html";
}

// LOGIN FORM

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function(e) {
        e.preventDefault();

        login(document.getElementById("roleSelect").value);
    });

    document.querySelectorAll(".demo-btn").forEach(b => {

        b.addEventListener("click", function() {

            const role = this.dataset.role;

            document.getElementById("email").value =
                role + "@college.edu";

            document.getElementById("password").value = "demo";

            document.getElementById("roleSelect").value = role;

            login(role);
        });
    });
}

// PAGE PROTECTION

if (
    ["student.html", "menu.html", "meal-bookings.html",
     "pass.html", "mess-card.html", "billing.html",
     "feedback.html"].includes(page) &&
    (!currentUser || currentUser.role !== "student")
) {
    location.replace("index.html");
}

if (
    page === "manager.html" &&
    (!currentUser || currentUser.role !== "manager")
) {
    location.replace("index.html");
}

// LOGOUT

function logout() {
    localStorage.removeItem("currentUser");
    location.href = "index.html";
}

// COMMON DISPLAY

function setText(id, value) {
    const el = document.getElementById(id);

    if (el) {
        el.textContent = value;
    }
}

if (currentUser && currentUser.role === "student") {

    setText("studentName", currentUser.name);
    setText("cardName", currentUser.name);
    setText("cardId", currentUser.studentId);
}

// STUDENT WEEKLY MENU

if (page === "menu.html") {
    showStudentMenu();
}

function showStudentMenu() {

    const t = document.getElementById("menuTable");

    if (!t) return;

    t.innerHTML = days.map(d => `
        <tr>
            <td>${d}</td>
            ${menu[d].map(x => `<td>${x}</td>`).join("")}
        </tr>
    `).join("");
}

// MEAL BOOKING

if (page === "meal-bookings.html") {

    const date = document.getElementById("bookDate");

    date.min = todayDate();
    date.value = todayDate();
}

function book(meal) {

    const date = document.getElementById("bookDate").value;

    if (!date || date < todayDate()) {
        alert("Please select today or a future date.");
        return;
    }

    const bookings = getData("bookings", []);

    const exists = bookings.some(b =>
        b.email === currentUser.email &&
        b.date === date &&
        b.meal === meal
    );

    if (exists) {
        alert("This meal is already booked for that date.");
        return;
    }

    bookings.push({
        email: currentUser.email,
        name: currentUser.name,
        date,
        meal,
        price: mealPrices[meal],
        status: "Booked"
    });

    saveData("bookings", bookings);

    alert("Meal booked successfully!");
}

// SELECT MEAL PASS

function selectPlan(key) {

    selectedPlan = key;

    setText("selectedPlanText", plans[key].name);

    setText(
        "selectedPlanPrice",
        "₹" + plans[key].price.toLocaleString("en-IN")
    );

    const b = document.getElementById("payButton");

    if (b) {
        b.disabled = false;
    }
}

// PROCEED TO PAYMENT

function proceedToPay() {

    if (!selectedPlan) {
        alert("Please select a meal plan first.");
        return;
    }

    const passes = getData("passes", []);

    const active = passes.find(p =>
        p.email === currentUser.email &&
        p.status === "Active" &&
        p.validUntil >= todayDate()
    );

    if (active && !confirm(
        "You already have an active pass. Replace it with this new 10-month pass?"
    )) {
        return;
    }

    const plan = plans[selectedPlan];
    const start = todayDate();

    const pass = {
        email: currentUser.email,
        name: currentUser.name,
        studentId: currentUser.studentId,
        planKey: selectedPlan,
        planName: plan.name,
        price: plan.price,
        validFrom: start,
        validUntil: addMonths(start, 10),
        status: "Active",
        paymentStatus: "Demo payment successful"
    };

    saveData(
        "passes",
        passes.filter(p =>
            p.email !== currentUser.email ||
            p.status !== "Active"
        ).concat(pass)
    );

    const payments = getData("payments", []);

    payments.push({
        email: currentUser.email,
        date: start,
        description: "10-month pass: " + plan.name,
        amount: plan.price,
        status: "Demo paid"
    });

    saveData("payments", payments);

    const msg = document.getElementById("paymentMessage");

    if (msg) {
        msg.innerHTML = `
            <div class="alert alert-success">
                Demo payment successful!
                Your 10-month pass is active.
                Amount: ₹${plan.price.toLocaleString("en-IN")}
            </div>
        `;
    }

    document.querySelectorAll('input[name="mealPlan"]')
        .forEach(x => x.checked = false);

    selectedPlan = "";

    setText("selectedPlanText", "None");
    setText("selectedPlanPrice", "₹0");

    document.getElementById("payButton").disabled = true;
}

// DIGITAL MESS CARD AND QR CODE

if (page === "mess-card.html") {
    showPassCard();
}

function showPassCard() {

    if (!currentUser) return;

    const p = getData("passes", []).find(x =>
        x.email === currentUser.email &&
        x.status === "Active" &&
        x.validUntil >= todayDate()
    );

    const qr = document.getElementById("passQr");
    const placeholder = document.getElementById("qrPlaceholder");

    if (!qr) return;

    if (!p) {

        setText("cardPlan", "No active pass");
        setText("passStart", "—");
        setText("passEnd", "—");
        setText("passStatus", "No active pass");

        qr.hidden = true;
        placeholder.hidden = false;

        return;
    }

    setText("cardPlan", p.planName);
    setText("passStart", displayDate(p.validFrom));
    setText("passEnd", displayDate(p.validUntil));
    setText("passStatus", "Active · Demo payment");

    const data =
        `MESS PASS | ID:${p.studentId} | NAME:${p.name} | PLAN:${p.planName} | VALID:${p.validFrom} TO ${p.validUntil}`;

    qr.src =
        "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" +
        encodeURIComponent(data);

    qr.hidden = false;
    placeholder.hidden = true;
}

// BILLING AND STATEMENT

if (page === "billing.html") {
    showStatement();
}

function showStatement() {

    const body = document.getElementById("statementBody");

    if (!body || !currentUser) return;

    const bookings = getData("bookings", [])
        .filter(b => b.email === currentUser.email);

    const payments = getData("payments", [])
        .filter(p => p.email === currentUser.email);

    const rows = [
        ...bookings.map(b => ({
            date: b.date,
            label: b.meal,
            amount: b.price,
            status: b.status,
            type: "booking"
        })),

        ...payments.map(p => ({
            date: p.date,
            label: p.description,
            amount: p.amount,
            status: p.status,
            type: "payment"
        }))
    ];

    body.innerHTML = rows.length
        ? rows.map(r => `
            <tr>
                <td>${r.date}</td>
                <td>${r.label}</td>
                <td>₹${r.amount.toLocaleString("en-IN")}</td>
                <td>${r.status}</td>
                <td>
                    ${r.type === "booking"
                        ? `<button class="btn btn-danger btn-sm"
                            onclick="cancelBooking('${r.date}','${r.label}')">
                            Cancel
                           </button>`
                        : "—"}
                </td>
            </tr>
        `).join("")
        : '<tr><td colspan="5">No transactions yet.</td></tr>';

    setText(
        "balance",
        rows.reduce((s, r) => s + r.amount, 0).toLocaleString("en-IN")
    );
}

// CANCEL BOOKING

function cancelBooking(date, meal) {

    if (!confirm("Cancel this individual meal booking?")) return;

    saveData(
        "bookings",
        getData("bookings", []).filter(b =>
            !(b.email === currentUser.email &&
              b.date === date &&
              b.meal === meal)
        )
    );

    showStatement();
}

// DOWNLOAD FILE

function downloadFile(filename, content, type) {

    const url = URL.createObjectURL(
        new Blob([content], {type})
    );

    const a = document.createElement("a");

    a.href = url;
    a.download = filename;

    document.body.appendChild(a);

    a.click();
    a.remove();

    URL.revokeObjectURL(url);
}

// DOWNLOAD CSV

function downloadStatement() {

    const b = getData("bookings", [])
        .filter(x => x.email === currentUser.email);

    const p = getData("payments", [])
        .filter(x => x.email === currentUser.email);

    const rows = [
        ["Date", "Description", "Amount", "Status"],

        ...b.map(x =>
            [x.date, x.meal, x.price, x.status]
        ),

        ...p.map(x =>
            [x.date, x.description, x.amount, x.status]
        )
    ];

    downloadFile(
        "mess-statement.csv",
        rows.map(r =>
            r.map(v =>
                `"${String(v).replace(/"/g, '""')}"`
            ).join(",")
        ).join("\n"),
        "text/csv"
    );
}

// DOWNLOAD E-BILL

function downloadBill() {

    const p = getData("payments", [])
        .filter(x => x.email === currentUser.email);

    const b = getData("bookings", [])
        .filter(x => x.email === currentUser.email);

    const total = [
        ...p.map(x => x.amount),
        ...b.map(x => x.price)
    ].reduce((a, x) => a + x, 0);

    downloadFile(
        "mess-e-bill.txt",
        `MESS MANAGEMENT PORTAL
Student: ${currentUser.name}
Student ID: ${currentUser.studentId}

Pass Payments:
${p.map(x =>
    `${x.description} - Rs.${x.amount} (${x.status})`
).join("\n")}

Individual Bookings:
${b.map(x =>
    `${x.date} ${x.meal} - Rs.${x.price}`
).join("\n")}

Total: Rs.${total}`,
        "text/plain"
    );
}

// STUDENT FEEDBACK

function setRating(v) {

    rating = v;

    setText("ratingText", v + " out of 5 selected");
}

function submitFeedback() {

    const c = document.getElementById("fbComment").value.trim();

    if (!rating || !c) {
        alert("Please select a rating and write a comment.");
        return;
    }

    const a = getData("feedback", []);

    a.push({
        name: currentUser.name,
        email: currentUser.email,
        rating,
        comment: c
    });

    saveData("feedback", a);

    document.getElementById("fbComment").value = "";

    rating = 0;

    setText("ratingText", "Choose a rating");

    alert("Feedback submitted successfully!");
}

// MANAGER DASHBOARD

if (page === "manager.html" && currentUser) {

    setText("managerName", currentUser.name);

    showCounts();
    showPasses();
    showInventory();
    showManagerMenu();
    showFeedback();
    showReports();
}

// TODAY'S MEAL COUNTS

function showCounts() {

    const el = document.getElementById("todayCounts");

    if (!el) return;

    const b = getData("bookings", [])
        .filter(x => x.date === todayDate());

    el.innerHTML = ["breakfast", "lunch", "dinner"]
        .map(m => `
            <li class="list-group-item d-flex justify-content-between">
                ${m}
                <strong>
                    ${b.filter(x => x.meal === m).length} bookings
                </strong>
            </li>
        `).join("");
}

// MANAGER VIEW OF PASSES

function showPasses() {

    const t = document.getElementById("passTable");

    if (!t) return;

    const a = getData("passes", []);

    t.innerHTML = a.length
        ? a.map(p => `
            <tr>
                <td>${p.name}</td>
                <td>${p.studentId}</td>
                <td>${p.planName}</td>
                <td>₹${p.price.toLocaleString("en-IN")}</td>
                <td>${displayDate(p.validUntil)}</td>
                <td>${p.validUntil >= todayDate() ? "Active" : "Expired"}</td>
            </tr>
        `).join("")
        : '<tr><td colspan="6">No passes purchased yet.</td></tr>';
}

// ADD INVENTORY

function addInventory() {

    const name = document.getElementById("invName").value.trim();

    const qty = Number(
        document.getElementById("invQty").value
    );

    const unit = document.getElementById("invUnit").value.trim();

    if (!name || !unit || qty <= 0) {
        alert("Enter valid inventory details.");
        return;
    }

    const a = getData("inventory", []);

    a.push({name, qty, unit});

    saveData("inventory", a);

    document.getElementById("invName").value = "";
    document.getElementById("invQty").value = "";
    document.getElementById("invUnit").value = "";

    showInventory();
    showReports();
}

// DISPLAY INVENTORY

function showInventory() {

    const t = document.getElementById("inventoryTable");

    if (!t) return;

    const a = getData("inventory", []);

    t.innerHTML = a.map((x, i) => `
        <tr>
            <td>${x.name}</td>
            <td>${x.qty}</td>
            <td>${x.unit}</td>
            <td>
                <button class="btn btn-danger btn-sm"
                onclick="deleteInventory(${i})">
                    Delete
                </button>
            </td>
        </tr>
    `).join("");

    document.getElementById("lowStockAlert")
        .classList.toggle(
            "d-none",
            !a.some(x => x.qty <= 5)
        );
}

// DELETE INVENTORY

function deleteInventory(i) {

    const a = getData("inventory", []);

    a.splice(i, 1);

    saveData("inventory", a);

    showInventory();
    showReports();
}

// ADD OR UPDATE DISH

function addDish() {

    const day = document.getElementById("dishDay").value;

    const meal = document.getElementById("dishMeal").value;

    const dish = document.getElementById("dishName").value.trim();

    if (!dish) {
        alert("Enter a dish name.");
        return;
    }

    const i = ["Breakfast", "Lunch", "Snacks", "Dinner"]
        .indexOf(meal);

    menu[day][i] = dish;

    saveData("menu", menu);

    document.getElementById("dishName").value = "";

    showManagerMenu();

    alert("Weekly menu updated!");
}

// DISPLAY MANAGER MENU

function showManagerMenu() {

    const t = document.getElementById("menuPreview");

    if (!t) return;

    t.innerHTML = days.map(d => `
        <tr>
            <td>${d}</td>
            ${menu[d].map(x => `<td>${x}</td>`).join("")}
        </tr>
    `).join("");
}

// DISPLAY FEEDBACK

function showFeedback() {

    const el = document.getElementById("allFeedback");

    if (!el) return;

    const a = getData("feedback", []);

    el.innerHTML = a.length
        ? a.map(f => `
            <div class="border rounded p-2 mb-2">
                <strong>${f.name}</strong>
                <span class="text-warning">
                    ${"★".repeat(f.rating)}
                </span>
                <p class="mb-0">${f.comment}</p>
            </div>
        `).join("")
        : "No feedback received yet.";
}

// MANAGER REPORTS

function showReports() {

    const el = document.getElementById("reportText");

    if (!el) return;

    const b = getData("bookings", []);
    const i = getData("inventory", []);
    const f = getData("feedback", []);
    const p = getData("passes", []);
    const pay = getData("payments", []);

    const active = p.filter(
        x => x.validUntil >= todayDate()
    ).length;

    const revenue = pay.reduce(
        (s, x) => s + x.amount, 0
    );

    el.textContent =
        `Individual Meal Bookings: ${b.length}
Active 10-Month Passes: ${active}
Pass Demo Revenue: ₹${revenue.toLocaleString("en-IN")}
Inventory Items: ${i.length}
Feedback Received: ${f.length}`;
}