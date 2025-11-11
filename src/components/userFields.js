export const userFields = [
  { name: "username", label: "Username", type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "password", label: "Password", type: "password", required: true },
  { name: "age", label: "Age", type: "number", required: true },
  { name: "gender", label: "Gender", type: "select", required: true, options: ["Male", "Female"] },
  { name: "level", label: "Level", type: "select", required: true, options: ["Level 1", "Level 2", "Level 3"] },
  { name: "maritalStatus", label: "Marital Status", type: "select", required: true, options: ["Married", "Single"] },

  // 🔽 These two will now load dynamically
  { name: "committee", label: "Committee", type: "select", required: false },
  { name: "subCommittee", label: "Sub Committee", type: "select", required: false },

  { name: "designation", label: "Designation", type: "select", required: true, options: ["Member", "Chairman", "Vice Chairman", "Secretary", "Staff"] },
  { name: "subscription", label: "Subscription", type: "select", required: true, options: ["Active", "Inactive"] },
  { name: "membertype", label: "Member Type", type: "select", required: true, options: ["Direct", "Indirect"] },
  { name: "fileNumber", label: "File Number", type: "text", required: true, },
  { name: "approveStatus", label: "Approve Status", type: "select", required: true, options: ["Approved", "Not Approved"] },
  { name: "waveSubscriptionStatus", label: "Wave Subscription", type: "select", required: true, options: ["Yes", "No"] },
];
