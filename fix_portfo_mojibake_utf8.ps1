$ErrorActionPreference = "Stop"

Write-Host "Fixing mojibake UTF-8 text..." -ForegroundColor Cyan

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

function U {
    param([int[]]$Codes)
    return -join ($Codes | ForEach-Object { [char]$_ })
}

function Mojibake {
    param([string]$Text)
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($Text)
    return [System.Text.Encoding]::GetEncoding(1252).GetString($bytes)
}

function Replace-InFile {
    param(
        [Parameter(Mandatory = $true)][string]$Path,
        [Parameter(Mandatory = $true)][hashtable]$Replacements
    )

    if (!(Test-Path -LiteralPath $Path)) {
        Write-Host "Skipping missing file: $Path" -ForegroundColor Yellow
        return
    }

    $content = [System.IO.File]::ReadAllText((Resolve-Path -LiteralPath $Path), [System.Text.Encoding]::UTF8)

    foreach ($key in $Replacements.Keys) {
        $content = $content.Replace($key, $Replacements[$key])
    }

    [System.IO.File]::WriteAllText((Resolve-Path -LiteralPath $Path), $content, $utf8NoBom)
    Write-Host "Fixed: $Path" -ForegroundColor Green
}

$Agrave = U 0x00C0
$ydiaeresis = U 0x00FF
$range = "$Agrave-$ydiaeresis"

$bang = U 0x00A1
$a_accent = U 0x00E1
$e_accent = U 0x00E9
$i_accent = U 0x00ED
$o_accent = U 0x00F3
$u_accent = U 0x00FA
$n_tilde = U 0x00F1
$O_accent = U 0x00D3

$mas = "m" + $a_accent + "s"
$Mas = "M" + $a_accent + "s"
$galeria = "Galer" + $i_accent + "a"
$anadir = "A" + $n_tilde + "adir"
$segun = "seg" + $u_accent + "n"
$animacion = "animaci" + $o_accent + "n"
$Animacion = "Animaci" + $O_accent + "n"
$seccion = "Secci" + $o_accent + "n"
$configuracion = "configuraci" + $o_accent + "n"
$Configuracion = "Configuraci" + $O_accent + "n"
$navegacion = "navegaci" + $o_accent + "n"
$registerCompleted = $bang + "Register Completed!"

$replacements = @{}

$replacements[(Mojibake $range)] = $range
$replacements[(Mojibake $registerCompleted)] = $registerCompleted
$replacements[(Mojibake $mas)] = $mas
$replacements[(Mojibake $Mas)] = $Mas
$replacements[(Mojibake $galeria)] = $galeria
$replacements[(Mojibake $anadir)] = $anadir
$replacements[(Mojibake $segun)] = $segun
$replacements[(Mojibake $animacion)] = $animacion
$replacements[(Mojibake $Animacion)] = $Animacion
$replacements[(Mojibake $seccion)] = $seccion
$replacements[(Mojibake $configuracion)] = $configuracion
$replacements[(Mojibake $Configuracion)] = $Configuracion
$replacements[(Mojibake $navegacion)] = $navegacion

# Extra explicit replacements for common corrupted sequences, built from char codes.
$replacements["m" + (U 0x00C3) + (U 0x00A1) + "s"] = $mas
$replacements["M" + (U 0x00C3) + (U 0x00A1) + "s"] = $Mas
$replacements["A" + (U 0x00C3) + (U 0x00B1) + "adir"] = $anadir
$replacements["seg" + (U 0x00C3) + (U 0x00BA) + "n"] = $segun
$replacements["Galer" + (U 0x00C3) + (U 0x00AD) + "a"] = $galeria
$replacements["animaci" + (U 0x00C3) + (U 0x00B3) + "n"] = $animacion
$replacements["Animaci" + (U 0x00C3) + (U 0x00B3) + "n"] = $Animacion
$replacements["Secci" + (U 0x00C3) + (U 0x00B3) + "n"] = $seccion
$replacements["configuraci" + (U 0x00C3) + (U 0x00B3) + "n"] = $configuracion
$replacements["Configuraci" + (U 0x00C3) + (U 0x00B3) + "n"] = $Configuracion
$replacements["navegaci" + (U 0x00C3) + (U 0x00B3) + "n"] = $navegacion
$replacements[(U 0x00C2) + $bang + "Register Completed!"] = $registerCompleted
$replacements["" + (U 0x00C3) + (U 0x0080) + "-" + (U 0x00C3) + (U 0x00BF)] = $range

$files = @(
    "content/demos/demo1.html",
    "content/demos/demo2.html",
    "content/service1.html",
    "content/partials/service1.html",
    "content/partials/home.html",
    "index.html"
)

foreach ($file in $files) {
    Replace-InFile -Path $file -Replacements $replacements
}

Write-Host "Done. Now run: git diff --check; git diff" -ForegroundColor Cyan
