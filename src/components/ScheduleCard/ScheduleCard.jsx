function ScheduleCard({ item }) {
  return (
    <div>
      {`${item.event_name} ${item.event_description} ${item.start_event}`}
      <br />
      <button>Edit</button>
    </div>
  );
}

export default ScheduleCard;
