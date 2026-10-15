VOX ECOSYSTEM v1.2.0 — CodeTech Developers

DEPLOY
1. Replace all files in your GitHub repo root with these files, commit, push (Vercel redeploys).

ADMIN (stop / resume a service)
1. Open the app > Info > tap the "Version" row 5 times > Admin Console appears.
2. Create a GitHub fine-grained token: only this repo, permission "Contents: Read and write".
3. In Admin Console fill username, repository, branch, token > Save connection.
4. Flip a service to Stopped (optional message) > Publish changes.
   Vercel redeploys in ~1 minute; the launcher then shows the service as Stopped on every device.

REALLY STOP THE WEBSITE ITSELF
The launcher only controls its own buttons. To also block the site itself, add this to the <head>
of each app (VoxCADD, Arch Pad Pro, 10to7):
  <script src="https://vox-ecosystem.vercel.app/service-guard.js" data-app="voxcadd"></script>
IDs: voxcadd | archpad | tento7
The app then shows a "Temporarily unavailable" screen while stopped. If the status can't be loaded
(offline), the app keeps working.
