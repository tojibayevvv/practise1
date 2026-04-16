import React, { useState } from "react";
import "./App.css";
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";

const defFriends = [
  {
    id: 2020,
    name: "Adam",
    balance: 20,
    image: "https://i.pinimg.com/736x/34/da/e2/34dae2b1c9a2c38bfdc18bbb5a414149.jpg",
  },
  {
    id: 2021,
    name: "Sofie",
    balance: -5,
    image: "https://i.pinimg.com/736x/9d/d5/8a/9dd58a62003f11d482f21a8c0b36bc16.jpg",
  },
  {
    id: 2022,
    name: "Heisenberg",
    balance: 0,
    image: "https://i.pinimg.com/736x/61/4a/07/614a079f976120770b469231c5c3a360.jpg",
  },
];

function Button({ children, onClick, type = "button" }) {
  return <button type={type} onClick={onClick}>{children}</button>;
}

export default function App() {
  const [friends, setFriends] = useState(defFriends);
  const [selected, setSelected] = useState(null);

  function handleAddFriend(friend) {
    setFriends((prev) => [...prev, friend]);
  }

  function handleSelection(friend) {
    setSelected((cur) => (cur?.id === friend.id ? null : friend));
  }

  // BUG FIX: Corrected balance sign logic
  // Positive balance = friend owes you | Negative balance = you owe friend
  function handleSplit(friend, bill, paidByUser, whoIsPaying) {
    const paidByFriend = bill - paidByUser;
    const delta = whoIsPaying === "user" ? paidByFriend : -paidByUser;

    setFriends((prev) =>
      prev.map((f) =>
        f.id === friend.id ? { ...f, balance: f.balance + delta } : f
      )
    );
    setSelected(null); // deselect after splitting
  }

  return (
    <div className="app">
      <SideBar friends={friends} selected={selected} onSelection={handleSelection} />
      {selected ? (
        <BillModal selected={selected} onSplit={handleSplit} />
      ) : (
        <AddFriend onAddFriend={handleAddFriend} />
      )}
    </div>
  );
}

function SideBar({ friends, selected, onSelection }) {
  return (
    <div className="sidebar">
      <FriendList friends={friends} selected={selected} onSelection={onSelection} />
    </div>
  );
}

function FriendList({ friends, selected, onSelection }) {
  return (
    <ul>
      {friends.map((person) => {
        const isSelected = selected?.id === person.id;
        return (
          <li key={person.id} className="friend">
            <img className="friend__image" src={person.image} alt={person.name} />
            <div className="friend__details">
              <h3>{person.name}</h3>
              {person.balance > 0 && (
                <div className="details">
                  <p>{person.name} owes you ${person.balance}</p>
                  <span><FaArrowTrendUp /></span>
                </div>
              )}
              {person.balance < 0 && (
                <div className="details">
                  <p>You owe {person.name} ${Math.abs(person.balance)}</p>
                  <span><FaArrowTrendDown /></span>
                </div>
              )}
              {person.balance === 0 && <p>You and {person.name} are even</p>}
            </div>
            <Button onClick={() => onSelection(person)}>
              {isSelected ? "Close" : "Select"}
            </Button>
          </li>
        );
      })}
    </ul>
  );
}

function BillModal({ selected, onSplit }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  const billNum = Number(bill);
  const paidByUserNum = Number(paidByUser);
  const paidByFriend = billNum ? billNum - paidByUserNum : "";

  // BUG FIX: Validate that user expense doesn't exceed total bill
  function handleUserExpenseChange(e) {
    const val = Number(e.target.value);
    if (val <= billNum) setPaidByUser(e.target.value);
  }

  function handleSubmit() {
    if (!billNum || !paidByUserNum) return;
    onSplit(selected, billNum, paidByUserNum, whoIsPaying);
    setBill("");
    setPaidByUser("");
    setWhoIsPaying("user");
  }

  return (
    <div className="bill_modal">
      {/* No need for early-return guard — App only renders this when selected is set */}
      <h2>Split bill with {selected.name}</h2>
      <form>
        <label>Bill</label>
        <input
          type="number"
          placeholder="e.g. 200"
          value={bill}
          onChange={(e) => setBill(e.target.value)}
        />
        <label>Your Expense</label>
        <input
          type="number"
          value={paidByUser}
          onChange={handleUserExpenseChange}
        />
        <label>{selected.name}'s Expense</label>
        <input type="number" value={paidByFriend} disabled />
        <label>Who is paying?</label>
        <select value={whoIsPaying} onChange={(e) => setWhoIsPaying(e.target.value)}>
          <option value="user">Me</option>
          <option value="friend">{selected.name}</option>
        </select>
        <Button onClick={handleSubmit}>Split</Button>
      </form>
    </div>
  );
}

function AddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !image.trim()) return;

    const id = crypto.randomUUID();
    onAddFriend({ id, name: name.trim(), image: `${image}?=${id}`, balance: 0 });

    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <div className="bill_modal">
      <form onSubmit={handleSubmit}>
        {/* BUG FIX: Typo "Fried's Name" → "Friend's Name" */}
        <label>Friend's Name</label>
        <input
          value={name}
          type="text"
          placeholder="Josh"
          onChange={(e) => setName(e.target.value)}
        />
        <label>Friend's Image URL</label>
        <input
          value={image}
          type="text"
          onChange={(e) => setImage(e.target.value)}
        />
        <Button type="submit">Add Friend</Button>
      </form>
    </div>
  );
}