function App() {
  return (
    <main className="grid grid-cols-4 text-white p-7">
      <section className="col-span-1">
        <h1 className="font-bold text-4xl">JsonToForm</h1>
      </section>

      {/* form display */}
      <section className="col-span-3">
        <p className="text-lg">
          <span className="bg-orange-500 rounded-sm text-orange-500">---</span>{" "}
          is an exploratory project that uses the factory design pattern for
          React. It provides a set of consistent and elegant conditional logic
          to components, which are designed to instantiate different form
          component formats based on a json array of props.
        </p>
      </section>
    </main>
  );
}

export default App;
