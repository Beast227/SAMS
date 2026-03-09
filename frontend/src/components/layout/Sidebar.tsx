interface SideBarProps {
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
}

function Sidebar({isCollapsed, setIsCollapsed}:SideBarProps) {
  return (
   isCollapsed ? <div>Collapsed</div> : <button onClick={()=>setIsCollapsed(true)}> Collapse </button>
  )
}

export default Sidebar