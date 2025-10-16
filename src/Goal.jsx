function Goal(props) {
  const isGoal = 0;
  function MadeGoal(){ return <h1>Goal</h1>}
  function MissedGoal(){ return <h1>He miseed the Goal</h1>}
   return (
    <>
      { isGoal == 0 ? <MadeGoal/> : <MissedGoal/> }
    </>
  );
}

export default Goal