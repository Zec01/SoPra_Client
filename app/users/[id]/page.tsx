// your code here for S2 to display a single user profile after having clicked on it
// each user has their own slug /[id] (/1, /2, /3, ...) and is displayed using this file
// try to leverage the component library from antd by utilizing "Card" to display the individual user
// import { Card } from "antd"; // similar to /app/users/page.tsx
import { Card } from "antd";

export default function UserPage({ params }: { params: { id: string } }) {
    return (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
            <Card title={`Benutzerprofil: ${params.id}`} style={{ width: 300 }}>
                <p>Hier sind die Details für Benutzer {params.id}.</p>
            </Card>
        </div>
    );
}
