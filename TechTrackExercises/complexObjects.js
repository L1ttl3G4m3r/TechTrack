const data = [
  {
    name: "robert",
    age: "29",
    residence: "amsterdam",
    siblings: 1,
    work: {
      title: "Lecturer",
      employer: "Hogeschool van Amsterdam",
    },
  },
  {
    name: "berend",
    age: "32",
    residence: "rotterdam",
    siblings: 0,
    work: {
      title: "Front-end Developer",
      employer: "DEPT",
    },
  },
  {
    name: "ubaida",
    age: "26",
    residence: "Amersfoort",
    siblings: 4,
    work: {
      title: "Project Manager",
      employer: "Clarify",
    },
  },
];

/* Normalize capitals in names, convert ages to numbers, remove siblings and work title 
   but keep employer as attribute.
    const data = [
        {
            name: "Robert",
            age: 29,
            residence: "Amsterdam",
            employer: "Hogeschool van Amsterdam"
        },
        {
            name: "Berend",
            age: 32,
            residence: "Rotterdam",
            employer: "DEPT"
        },
        {
            name: "ubaida",
            age: "26",
            residence: "Amersfoort",
            employer: "Clarify"
        }
    ];
*/

// function transformArrayOfObj() returns an Array of objects
function transformArrOfObj(myData) {
  /* Write your functionality here and return the result */
  const antwoord = [];

  myData.forEach((person) => {
    const otherPerson = {
      name: person.name.charAt(0).toUpperCase() + person.name.slice(1).toLowerCase(),
      age: Number(person.age),
      residence: person.residence.charAt(0).toUpperCase() + person.residence.slice(1).toLowerCase(),
      employer: person.work.employer,
    };

    antwoord.push(otherPerson);
  });

  return antwoord;
}

console.log(transformArrOfObj(data));
