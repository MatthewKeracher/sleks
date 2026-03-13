// Create family array
const family = [
  new Entry({ name: ["Homer", "", "Simpson"], age: [1956], sex: "M" }),      // 0
  new Entry({ name: ["Marge", "", "Simpson"], age: [1958], sex: "F" }),      // 1  
  new Entry({ name: ["Bart", "", "Simpson"], age: [1989], sex: "M" }),       // 2
  new Entry({ name: ["Lisa", "", "Simpson"], age: [1992], sex: "F" }),       // 3
  new Entry({ name: ["Maggie", "", "Simpson"], age: [1995], sex: "F" }),     // 4
  new Entry({ name: ["Abe", "", "Simpson"], age: [1919], sex: "M" }),        // 5
  new Entry({ name: ["Mona", "", "Simpson"], age: [1925], sex: "F" }),       // 6
  new Entry({ name: ["Clancy", "", "Bouvier"], age: [1920], sex: "M" }),     // 7
  new Entry({ name: ["Jacqueline", "", "Bouvier"], age: [1926], sex: "F" }), // 8
  new Entry({ name: ["Herb", "", "Powell"], age: [1954], sex: "M" }),        // 9
  new Entry({ name: ["Patty", "", "Bouvier"], age: [1956], sex: "F" }),      // 10
  new Entry({ name: ["Selma", "", "Bouvier"], age: [1958], sex: "F" }),      // 11
  new Entry({ name: ["Ling", "", "Bouvier"], age: [2002], sex: "F" })        // 12
];

// Add all to people
family.forEach(person => people.add(person));

// **RELATIONSHIPS using family array indices**
family[0].link("spouse", family[1]);  // homer ↔ marge
family[1].link("spouse", family[0]);



family[0].link("father", family[5]);   // homer → abe
family[0].link("mother", family[6]);   // homer → mona

family[2].link("father", family[0]);   // bart → homer
family[2].link("mother", family[1]);   // bart → marge

family[3].link("father", family[0]);   // lisa → homer
family[3].link("mother", family[1]);   // lisa → marge

family[1].link("father", family[7]);   // marge → clancy
family[1].link("mother", family[8]);   // marge → jacqueline

family[5].link("spouse", family[6]);   // abe ↔ mona
family[7].link("spouse", family[8]);   // clancy ↔ jacqueline







