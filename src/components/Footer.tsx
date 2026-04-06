export default function Footer() {
  return (
    <footer style={{ borderTop:'1px solid rgba(201,168,76,.1)', padding:'40px 24px', textAlign:'center', background:'rgba(10,10,15,.6)' }}>
      <div style={{ maxWidth:1280, margin:'0 auto' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, marginBottom:12 }}>
          <div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#c9a84c,#a07830)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontFamily:"'Shippori Mincho',serif", color:'#0a0a0f', fontWeight:700 }}>桃</div>
          <span style={{ fontFamily:"'Shippori Mincho',serif", fontSize:14, color:'var(--kogane)', fontWeight:700 }}>株式会社桃山社中 DX推進ポータル</span>
        </div>
        <p style={{ fontSize:12, color:'rgba(245,240,232,.3)', lineHeight:1.8 }}>
          大阪市中央区森ノ宮中央1-6-9 ／ 2026年度（令和8年度）公的支援活用戦略<br/>
          ※本ポータルの補助金情報は参考値です。最新情報は各公的機関の公式サイトをご確認ください。
        </p>
        <p style={{ marginTop:14, fontSize:11, color:'rgba(245,240,232,.15)' }}>© 2026 Momoyama Shachuu Co., Ltd.</p>
      </div>
    </footer>
  )
}
