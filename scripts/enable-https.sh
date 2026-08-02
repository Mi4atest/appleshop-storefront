#!/usr/bin/env bash
set -euo pipefail

DOMAIN="shop.ap43.ru"
EXPECTED_IP="62.84.172.102"
EMAIL="${CERTBOT_EMAIL:-admin@ap43.ru}"

current_ip="$(dig +short "$DOMAIN" A | tail -n1 || true)"
echo "DNS $DOMAIN → ${current_ip:-<empty>}"
echo "Expected → $EXPECTED_IP"

if [[ "$current_ip" != "$EXPECTED_IP" ]]; then
  echo "Сначала обновите A-запись $DOMAIN на $EXPECTED_IP и дождитесь распространения DNS."
  exit 1
fi

certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos -m "$EMAIL" --redirect
systemctl reload nginx
echo "HTTPS готов: https://$DOMAIN"
