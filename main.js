"use strict";

const noteBtn = document.querySelector("[data-noteBtn]"),
formContainer = document.querySelector("[data-formContainer]"),
noteForm = document.querySelector("[data-form]"),
closeBtn = document.querySelector("[data-close]"),
overlay = document.querySelector("[data-overlay]"),
noteTitleInput = document.querySelector("[data-title]"),
noteDescInput = document.querySelector("[data-desc]"),
notesContainer = document.querySelector("[data-notes-container]"),
noteCount = document.querySelector("[data-count]"),
popUpTitle = document.querySelector("[data-popup-title]"),
searchInput = document.querySelector("[data-search]");


// our global variables
/**
 * getting value from local storage and if no value then empty array also we are parsing from json string to object of array
 */
const allNotes = JSON.parse(localStorage.getItem("notes")) || [];
let isEdited = false;
let editId;

// displaying the notes
const displayNotes = (allNotes) => {
    if(allNotes.length < 1){
        notesContainer.innerHTML = "<div class='notfound'><h1>No notes found</h1></div>";
    } else {
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
                        <button class="dots" onClick="showSettings(this)"><i class='bx bx-dots-vertical-rounded'></i></button>
    
                        <div class="extra" data-extra-details>
                            <button class="edit" data-btn onClick="editNote(this, ${note.id})"><i class='bx bxs-edit'></i> <span>Edit</span> </button>
                            <button class="delete" data-btn onClick="deleteNote(this, ${note.id})"><i class='bx bx-trash' ></i><span>Delete</span></button>
                        </div>
                    </div>
                </div>
            </div>
            `;
        }).join("");
    }


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

    // if isedited true then edit that particular note otherwise push new note
    if(isEdited){
        isEdited = false;
        
        allNotes.forEach((note) => {
            if(note.id === editId) {
                note.title = noteTitle;
                note.description = noteDesc;
                note.current = date;
            }
        });

    } else {
        // pushing note in allnotes array
        allNotes.push(note);
    }

    // saving in local storage
    saveLocalStorage(allNotes);
    // displaying updated note after adding
    displayNotes(allNotes);

    // updaing note count
    noteCount.textContent = allNotes.length;

    // clearing values of input and taxtarea
    noteTitleInput.value = "";
    noteDescInput.value = "";

    // closing form popup
    closeBtn.click();
});

// showing settings on clock of 3 dots
const showSettings = (selected) => {
    const parent = selected.parentElement;
    const extraDetails = parent.querySelector("[data-extra-details]");

    extraDetails.classList.toggle("active");

}

// edit note function
const editNote = (selected, id) => {
    const parent = selected.parentElement;
    parent.classList.remove("active");

    isEdited = true;
    editId = id;

    noteBtn.click();
    allNotes.forEach((note) => {
        if(note.id === id) {
            noteTitleInput.value = note.title;
            noteDescInput.value = note.description;
        }
    });

    popUpTitle.textContent = "Update Note";
}


// delete note function
const deleteNote = (selected, id) => {
    const parent = selected.parentElement;
    parent.classList.remove("active");

    // looping existing and deleting clicked note
    allNotes.forEach((note, index) => {
        if(note.id === id) {
            allNotes.splice(index, 1);
        }
    });

    // saving in local storage
    saveLocalStorage(allNotes);
    // displaying updated note after deleting
    displayNotes(allNotes);

    // updaing note count
    noteCount.textContent = allNotes.length;
}

// search functionalty
searchInput.addEventListener("input", (e) => {
    const userInput = e.target.value.toLowerCase();

    if(userInput){
        displayNotes(
            allNotes.filter((note) => note.title.toLowerCase().indexOf(userInput) > -1)
        );
    } else {
        displayNotes(allNotes);
    }
    
});

// toggling buttons
noteBtn.addEventListener("click", (e) => {
    formContainer.classList.add("show");
});

closeBtn.addEventListener("click", (e) => {
    formContainer.classList.remove("show");
    popUpTitle.textContent = "Add Note";
});

overlay.addEventListener("click", () => {
    formContainer.classList.remove("show");
});