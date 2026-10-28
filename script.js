
const noticeList = document.getElementById("noticeList");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const adminPanel = document.getElementById("adminPanel");
const logoutButton = document.getElementById("logoutButton");

const noticeForm = document.getElementById("noticeForm");
const noticeId = document.getElementById("noticeId");
const noticeTitle = document.getElementById("noticeTitle");
const noticeDescription = document.getElementById("noticeDescription");
const noticeCategory = document.getElementById("noticeCategory");
const expiryDate = document.getElementById("expiryDate");
const saveNoticeButton = document.getElementById("saveNoticeButton");
const cancelEditButton = document.getElementById("cancelEditButton");
const adminMessage = document.getElementById("adminMessage");

// Sample notices for frontend testing
let notices = [
    {
        id: 1,
        title: "Mid-Semester Examination",
        description: "Mid-semester examinations will begin on 10 November. Students should check their timetable.",
        category: "Exams",
        createdAt: "2026-10-25",
        expiryDate: "2026-11-10"
    },
    {
        id: 2,
        title: "Annual College Fest",
        description: "The annual college fest will be held on campus. Interested students can register with their class representatives.",
        category: "Events",
        createdAt: "2026-10-24",
        expiryDate: "2026-11-15"
    },
    {
        id: 3,
        title: "Assignment Submission",
        description: "Students must submit their pending assignments to the respective subject teachers before the deadline.",
        category: "General",
        createdAt: "2026-10-23",
        expiryDate: ""
    }
];

let nextId = 4;

// Display notices safely
function displayNotices() {
    const searchText = searchInput.value.trim().toLowerCase();
    const selectedCategory = categoryFilter.value;

    const filteredNotices = notices.filter(function (notice) {
        const matchesSearch =
            notice.title.toLowerCase().includes(searchText) ||
            notice.description.toLowerCase().includes(searchText);

        const matchesCategory =
            selectedCategory === "All" ||
            notice.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    noticeList.replaceChildren();

    if (filteredNotices.length === 0) {
        const message = document.createElement("p");
        message.textContent = "No notices found.";
        noticeList.appendChild(message);
        return;
    }

    filteredNotices.forEach(function (notice) {
        const card = document.createElement("article");
        card.className = "notice-card";

        const title = document.createElement("h3");
        title.textContent = notice.title;

        const description = document.createElement("p");
        description.textContent = notice.description;

        const category = document.createElement("span");
        category.className = "notice-category";
        category.textContent = notice.category;

        const date = document.createElement("p");
        date.className = "notice-date";
        date.textContent = "Published: " + notice.createdAt;

        card.append(title, description, category, date);

        if (notice.expiryDate) {
            const expiry = document.createElement("p");
            expiry.className = "notice-date";
            expiry.textContent = "Expiry date: " + notice.expiryDate;
            card.appendChild(expiry);
        }

        if (!adminPanel.hidden) {
            const editButton = document.createElement("button");
            editButton.type = "button";
            editButton.textContent = "Edit";
            editButton.addEventListener("click", function () {
                editNotice(notice.id);
            });

            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener("click", function () {
                deleteNotice(notice.id);
            });

            card.append(editButton, deleteButton);
        }

        noticeList.appendChild(card);
    });
}

// Demo-only login: any valid-looking email and non-empty password
loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
        loginMessage.textContent = "Please enter your email and password.";
        return;
    }

    loginForm.hidden = true;
    adminPanel.hidden = false;
    loginMessage.textContent = "Demo login successful.";
    adminMessage.textContent = "You can now manage sample notices.";

    displayNotices();
});

// Logout from the demo panel
logoutButton.addEventListener("click", function () {
    adminPanel.hidden = true;
    loginForm.hidden = false;
    loginForm.reset();
    noticeForm.reset();

    noticeId.value = "";
    saveNoticeButton.textContent = "Publish Notice";
    cancelEditButton.hidden = true;

    loginMessage.textContent = "You have logged out.";
    adminMessage.textContent = "";

    displayNotices();
});

// Add or update a notice
noticeForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const title = noticeTitle.value.trim();
    const description = noticeDescription.value.trim();
    const category = noticeCategory.value;
    const expiry = expiryDate.value;

    if (!title || !description) {
        adminMessage.textContent = "Title and description are required.";
        return;
    }

    if (expiry && expiry < new Date().toISOString().slice(0, 10)) {
        adminMessage.textContent = "Expiry date cannot be in the past.";
        return;
    }

    if (!["Exams", "Events", "General"].includes(category)) {
        adminMessage.textContent = "Please select a valid category.";
        return;
    }

    if (noticeId.value) {
        const id = Number(noticeId.value);
        const existingNotice = notices.find(function (notice) {
            return notice.id === id;
        });

        if (!existingNotice) {
            adminMessage.textContent = "Notice not found.";
            return;
        }

        existingNotice.title = title;
        existingNotice.description = description;
        existingNotice.category = category;
        existingNotice.expiryDate = expiry;

        adminMessage.textContent = "Notice updated successfully.";
    } else {
        notices.unshift({
            id: nextId++,
            title: title,
            description: description,
            category: category,
            createdAt: new Date().toISOString().slice(0, 10),
            expiryDate: expiry
        });

        adminMessage.textContent = "Notice published successfully.";
    }

    noticeForm.reset();
    noticeId.value = "";
    saveNoticeButton.textContent = "Publish Notice";
    cancelEditButton.hidden = true;

    displayNotices();
});

// Load notice details into the form for editing
function editNotice(id) {
    const notice = notices.find(function (item) {
        return item.id === id;
    });

    if (!notice) {
        adminMessage.textContent = "Notice not found.";
        return;
    }

    noticeId.value = notice.id;
    noticeTitle.value = notice.title;
    noticeDescription.value = notice.description;
    noticeCategory.value = notice.category;
    expiryDate.value = notice.expiryDate;

    saveNoticeButton.textContent = "Update Notice";
    cancelEditButton.hidden = false;
    adminMessage.textContent = "Edit the details and click Update Notice.";

    noticeTitle.focus();
}

// Delete a notice
function deleteNotice(id) {
    const confirmed = window.confirm(
        "Are you sure you want to delete this notice?"
    );

    if (!confirmed) {
        return;
    }

    notices = notices.filter(function (notice) {
        return notice.id !== id;
    });

    if (Number(noticeId.value) === id) {
        noticeForm.reset();
        noticeId.value = "";
        saveNoticeButton.textContent = "Publish Notice";
        cancelEditButton.hidden = true;
    }

    adminMessage.textContent = "Notice deleted successfully.";
    displayNotices();
}

// Cancel editing
cancelEditButton.addEventListener("click", function () {
    noticeForm.reset();
    noticeId.value = "";
    saveNoticeButton.textContent = "Publish Notice";
    cancelEditButton.hidden = true;
    adminMessage.textContent = "Editing cancelled.";
});

// Search and category filter
searchInput.addEventListener("input", displayNotices);
categoryFilter.addEventListener("change", displayNotices);

// Initial display
displayNotices();
