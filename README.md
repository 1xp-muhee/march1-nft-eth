# march1-nft-eth

3.1절 테마 NFT 100개 생성 + 이더리움 민팅용 샘플 프로젝트.

## Included
- `assets/1.svg ~ 100.svg`
- `metadata/1.json ~ 100.json`
- `contracts/March1NFT.sol` (ERC721URIStorage)
- `web/index.html` (GitHub Pages에서 민팅 UI)

## Deploy contract (quick)
1. Remix에서 `contracts/March1NFT.sol` 컴파일
2. constructor `initialOwner`에 본인 지갑 주소 입력 후 배포
3. 배포된 컨트랙트 주소를 `web/index.html`에서 입력해 민팅

## GitHub Pages
이 repo를 Pages로 배포하면:
- `https://<user>.github.io/march1-nft-eth/web/`

## Note
- 본 프로젝트는 교육/아트용 예시입니다.
- 실제 판매/법적 이슈는 별도 검토 필요.
