import flet as ft
import json

def main(page: ft.Page):
    page.title = "Isometric Game (Flet)"
    page.padding = 0
    page.spacing = 0
    page.theme_mode = ft.ThemeMode.DARK

    # Game State (Backend data)
    level_data = {
        "grid": [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
            [0, 1, 1, 1, 1, 1, 1, 0, 1, 0],
            [0, 0, 0, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 1, 1, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 0, 0, 0, 1, 0, 1, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ],
        "start_pos": {"x": 1, "z": 1},
        "gridSize": 10
    }

    # Flet HUD Components
    health_text = ft.Text("3", size=20, weight="bold")
    energy_text = ft.Text("100", size=20, weight="bold")
    coins_text = ft.Text("0", size=20, weight="bold")

    def handle_save(e):
        # We can request state from JS here
        page.run_javascript("saveGameFromJS()")

    hud = ft.Container(
        content=ft.Column([
            ft.Row([
                ft.Container(ft.Row([ft.Text("❤️"), health_text]), bgcolor="#44000000", padding=10, border_radius=10),
                ft.Container(ft.Row([ft.Text("⚡"), energy_text]), bgcolor="#44000000", padding=10, border_radius=10),
                ft.Container(ft.Row([ft.Text("💰"), coins_text]), bgcolor="#44000000", padding=10, border_radius=10),
            ], spacing=10),
            ft.Container(
                content=ft.Column([
                    ft.Text("Mission:", size=16, color="gold", weight="bold"),
                    ft.Text("Look for ways to go and defeat Sir Booble!", size=14),
                    ft.Button("Save Game", on_click=handle_save)
                ]),
                bgcolor="#44000000",
                padding=15,
                border_radius=10,
                width=250
            )
        ]),
        top=20,
        left=20
    )

    # Game View Placeholder
    # Since HtmlElementView is missing in Flet 0.80.5, we use a Container
    # and inject an iframe via JavaScript.
    game_container = ft.Container(
        content=ft.Text("Preparing game world...", color="white"),
        alignment=ft.Alignment.CENTER,
        expand=True,
        bgcolor="black",
        data="game-placeholder" # Helper to find it in JS
    )

    # Layout
    page.add(
        ft.Stack([
            game_container,
            hud
        ], expand=True)
    )

    # JS Injection Workaround
    inject_js = f"""
    setTimeout(() => {{
        const container = document.querySelector('div[data-flet-active="true"]');
        if (!container) return;
        
        // Find our placeholder by checking text or using a more specific selector
        // Flet renders Containers as divs. We'll look for the one with our "Preparing..." text or data tag.
        const target = Array.from(document.querySelectorAll('div')).find(el => el.innerText === "Preparing game world...");
        
        if (target) {{
            target.innerHTML = ''; // Clear text
            const iframe = document.createElement('iframe');
            iframe.src = "assets/game.html"; // Flet serves assets from /assets/
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.border = 'none';
            target.appendChild(iframe);
            
            iframe.onload = () => {{
                console.log("Iframe loaded, initializing game...");
                setTimeout(() => {{
                    if (iframe.contentWindow && iframe.contentWindow.initGame) {{
                        iframe.contentWindow.initGame({json.dumps(level_data)});
                    }}
                }}, 1000);
            }};
        }}
    }}, 500);
    """
    
    page.run_javascript(inject_js)

ft.run(main, assets_dir="assets", view=ft.AppView.WEB_BROWSER)
