"use strict";

const noteBtn = document.querySelector("[data-noteBtn]"),
formContainer = document.querySelector("[data-formContainer]"),
noteForm = document.querySelector("[data-form]"),
closeBtn = document.querySelector("[data-close]"),
overlay = document.querySelector("[data-overlay]"),
settings = document.querySelector("[data-settings]"),
extraDetails = document.querySelector("[data-extra-details]"),
noteTitleInput = document.querySelector("[data-title]"),
noteDescInput = document.querySelector("[data-desc]"),
notesContainer = document.querySelector("[data-notes-container]"),
noteCount = document.querySelector("[data-count]");


// our global variables
/**
 * getting value from local storage and if no value then empty array also we are parsing from json string to object of array
 */
const allNotes = JSON.parse(localStorage.getItem("notes")) || [];

// displaying the notes
const displayNotes = (allNotes) => {
    notesContainer.innerHTML = allNotes.map((note) => {
        return `
        <div class="note">
            <div class="content">
                <h2>${note.title}</h2>
                <p>${note.description}</p>
            </div>
            <div class="details">
                <p class="date">${note.current}</p>
                <div class="settings">
                    <button class="dots" data-settings><i class='bx bx-dots-vertical-rounded'></i></button>

                    <div class="extra" data-extra-details>
                        <button class="edit" data-btn><i class='bx bxs-edit'></i> <span>Edit</span> </button>
                        <button class="delete" data-btn><i class='bx bx-trash' ></i><span>Delete</span></button>
                    </div>
                </div>
            </div>
        </div>
        `;
    }).join("");
}

// onpage load
document.addEventListener("DOMContentLoaded", () => {
    displayNotes(allNotes);
    noteCount.textContent = allNotes.length;
});

// saving in local storage
const saveLocalStorage = (notes) => {
    localStorage.setItem("notes", JSON.stringify(notes));
}

// date creating
const currantDate = () => {
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["JAN", "FEB", "MARCH", "APRIL", "MAY", "JUNE", "AUG", "SEP", "OCT", "NOV", "DEC"];

    const date = new Date();
    const day = date.getDate();
    const year = date.getFullYear();
    const monthI = date.getMonth();
    const weekDayI = date.getDay();

    const month = months[monthI];
    const weekDay = weekDays[weekDayI];

    return `${day} ${month}, ${year} | ${weekDay}`;
}

noteForm.addEventListener("submit", (e) => {
    e.preventDefault();
    // getting title and description
    const noteTitle = noteTitleInput.value.trim();
    const noteDesc = noteDescInput.value.trim();
    // checking if user actually typed any title or description if he didn't type either we show alert
    if(noteTitle.length < 1 || noteDesc.length< 1){
        alert("Please Enter both Title and description");
        return;
    }

    // getting current date
    const date = currantDate();

    // creating object of note
    const note = {
        id: Date.now(),
        title: noteTitle,
        description: noteDesc,
        current: date
    };
    // pushing note in allnotes array
    allNotes.push(note);

    // saving in local storage
    saveLocalStorage(allNotes);
    displayNotes(allNotes);

    noteCount.textContent = allNotes.length;

    // clearing values of input and taxtarea
    noteTitleInput.value = "";
    noteDescInput.value = "";

    // closing form popup
    closeBtn.click();
});


















// toggling buttons

noteBtn.addEventListener("click", (e) => {
    formContainer.classList.add("show");
});

closeBtn.addEventListener("click", (e) => {
    formContainer.classList.remove("show");
});

overlay.addEventListener("click", () => {
    formContainer.classList.remove("show");
});

settings.addEventListener("click", () => {
    extraDetails.classList.toggle("active");
});
