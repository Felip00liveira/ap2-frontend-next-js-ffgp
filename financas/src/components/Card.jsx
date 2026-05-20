function Card({ title, value }) {
  return (
    <div style={styles.card}>
      <p>{title}</p>
      <h3>{value}</h3>
    </div>
  )
}

const styles = {
  card: {
    background: '#1e293b',
    padding: '20px',
    borderRadius: '10px',
    minWidth: '150px'
  }
}

export default Card