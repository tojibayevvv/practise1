import React, { useState } from "react";
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

function Button({ children, onClick }) {
  return <button onClick={onClick}>{children}</button>;
}

export default function App() {
  const [friends, setFriends] = useState(defFriends);
  const [selected, setSelected] = useState(null);

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
  }

  function handleSelection(friend) {
    setSelected((cur) => (cur?.id === friend.id ? null : friend));
  }

  function handleSplit(friend, bill, paidByUser, whoIsPaying) {
    const paidByFriend = bill - paidByUser;
    let amount = 0;
    if (whoIsPaying === "user") {
      amount = -paidByFriend; // friend owes user
    } else {
      amount = paidByUser; // user owes friend
    }
    setFriends((friends) =>
      friends.map((f) =>
        f.id === friend.id ? { ...f, balance: f.balance + amount } : f
      )
    );
  }

  return (
    <div className="app">
      <SideBar
        friends={friends}
        select={selected}
        onSelection={handleSelection}
      />
      <BillModal select={selected} onSplit={handleSplit} />
      <AddFriend onAddFriend={handleAddFriend} />
    </div>
  );
}

function SideBar({ friends, select, onSelection }) {
  return (
    <div className="sidebar">
      <FriendList friend={friends} select={select} onSelection={onSelection} />
    </div>
  );
}

function FriendList({ friend, select, onSelection }) {
  return (
    <ul>
      {friend.map((person) => {
        const isSelected = select?.id === person.id;
        return (
          <li key={person.id} className="friend">
            <img
              className="friend__image"
              src={person.image}
              alt={person.name}
            />
            <div className="friend__details">
              <h3>{person.name}</h3>
              {person.balance < 0 && (
                <div className="details">
                  <p>
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

function BillModal({ select, onSplit }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const [whoIsPaying, setWhoIsPaying] = useState("user");
  const paidByFriend = bill ? bill - paidByUser : "";

  if (!select) {
    return (
      <div className="bill_modal">
        <p>Select a friend first to split the bill.</p>
      </div>
    );
  }

  function handleSplit() {
    if (!bill || !paidByUser) return;
    onSplit(select, Number(bill), Number(paidByUser), whoIsPaying);
    // Reset form
    setBill("");
    setPaidByUser("");
    setWhoIsPaying("user");
  }

  return (
    <div className="bill_modal">
      <form>
        <label>Bill</label>
        <input
          type="text"
          placeholder="e.g 200"
          value={bill}
          onChange={(e) => setBill(e.target.value)}
        />
        <label>Your Expense</label>
        <input
          type="text"
          value={paidByUser}
          onChange={(e) => setPaidByUser(e.target.value)}
        />
        <label>{select.name}'s Expense</label>
        <input type="text" value={paidByFriend} disabled />
        <label>Who is paying?</label>
        <select
          value={whoIsPaying}
          onChange={(e) => setWhoIsPaying(e.target.value)}
        >
          <option value="user">Me</option>
          <option value="friend">{select.name}</option>
        </select>
        <Button onClick={handleSplit}>Split</Button>
      </form>
    </div>
  );
}

function AddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !image) return;

    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    onAddFriend(newFriend);

    setName("");
    setImage("https://i.pravatar.cc/48");
  }
  return (
    <div className="bill_modal">
      <form onSubmit={handleSubmit}>
        <label>Fried's Name</label>
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
        <Button>Submit</Button>
      </form>
    </div>
  );
}
