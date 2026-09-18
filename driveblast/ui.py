from typing import Optional
from rich.console import Console
from rich.panel import Panel
from rich.progress import (
    BarColumn,
    DownloadColumn,
    Progress,
    SpinnerColumn,
    TextColumn,
    TimeRemainingColumn,
    TransferSpeedColumn,
)
from rich.theme import Theme

custom_theme = Theme({
    "info": "cyan",
    "warning": "yellow",
    "error": "bold red",
    "success": "bold green",
    "accent": "bold magenta"
})

console = Console(theme=custom_theme)


def print_banner():
    """Prints a clean CLI banner."""
    console.print(
        Panel.fit(
            "[bold cyan]⚡ DriveBlast[/bold cyan] [dim]v0.1.0[/dim]\n"
            "[italic dim]High-speed Google Drive Downloader with Resume Support[/italic dim]",
            border_style="cyan"
        )
    )


def print_success(message: str):
    console.print(f"[success]✔[/success] {message}")


def print_info(message: str):
    console.print(f"[info]ℹ[/info] {message}")


def print_warning(message: str):
    console.print(f"[warning]⚠[/warning] {message}")


def print_error(message: str):
    console.print(f"[error]✘ Error:[/error] {message}")


def create_progress_bar(transient: bool = False) -> Progress:
    """Creates a Rich Progress instance configured for file downloading."""
    return Progress(
        SpinnerColumn("dots", style="cyan"),
        TextColumn("[bold cyan]{task.fields[filename]}", justify="left"),
        BarColumn(bar_width=35, complete_style="cyan", finished_style="green"),
        TextColumn("[progress.percentage]{task.percentage:>3.1f}%"),
        DownloadColumn(),
        TransferSpeedColumn(),
        TimeRemainingColumn(),
        console=console,
        transient=transient,
    )
