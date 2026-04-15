import React from "react";
import "./App.css";
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";

const defFriends = [
  {
    id: 2020,
    name: "Adam",
    balance: 20,
    image:
      "https://i.pinimg.com/736x/34/da/e2/34dae2b1c9a2c38bfdc18bbb5a414149.jpg",
  },
  {
    id: 2021,
    name: "Sofie",
    balance: -5,
    image:
      "https://i.pinimg.com/736x/9d/d5/8a/9dd58a62003f11d482f21a8c0b36bc16.jpg",
  },
  {
    id: 2022,
    name: "Heisenberg",
    balance: 0,
    image:
      "https://i.pinimg.com/736x/61/4a/07/614a079f976120770b469231c5c3a360.jpg",
  },
];

export default function App() {
  return (
    <div className="app">
      <SideBar />
      <AddModal />
    </div>
  );
}

function SideBar() {
  return (
    <div className="sidebar">
      <FriendList />
    </div>
  );
}

function FriendList() {
  return (
    <ul>
      {defFriends.map((person) => (
        <li key={person.id} className="friend">
          <img className="friend__image" src={person.image} alt={person.name} />
          <div className="friend__details">
            <h3>{person.name}</h3>
            {person.balance < 0 && (
              <div className="details">
                <p className="debt">
                  {person.name} owes you {Math.abs(person.balance)}$
                </p>
                <span>
                  <FaArrowTrendDown />
                </span>
              </div>
            )}
            {person.balance > 0 && (
              <div className="details">
                <p>
                  You owe {person.name} {person.balance}$
                </p>
                <span>
                  <FaArrowTrendUp />
                </span>
              </div>
            )}
            {person.balance === 0 && (
              <p className="equal">You and {person.name} are even</p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

function AddModal() {
  return (
    <div className="add-modal">
      <form>
        <label>Bill</label>
        <input type="text" placeholder="200" />
        <label>Your Expense</label>
        <input type="text" />
        <label>XXX's Expense</label>
        <input type="text" disabled />
        <label>Who is paying?</label>
        <select>
          <option value="">Me</option>
          <option value="">[Friend name]</option>
        </select>
      </form>
    </div>
  );
}
