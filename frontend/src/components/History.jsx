import pieces from "../pieces";

export default History = ({history}) => {

  let totalMoves = [];
  let singleMove = [];
  for (let move of history) {
    if (singleMove.length < 2) {
      singleMove.push({
        piece: move.piece,
        san: move.san
      });
    } else {
      totalMoves.push(singleMove);
      singleMove = [{
        piece: move.piece,
        san: move.san
      }];
    }
  }
  totalMoves.push(singleMove);
  console.log(totalMoves);

  return (
    <div>
      {
        totalMoves.map(e => {
          return (
            <div className="flex justify-stretch w-15">
              <div className="flex items-end mr-10">
                <img src={pieces.white[e[0].piece]} width="25" className="mr-1" style={{maxWidth: 25}}/>
                <p className="w-5">{e[0].san}</p>
              </div>
              {
                e.length > 1 && (
                  <div className="flex items-end">
                    <img src={pieces.black[e[1].piece]} width="25" className="mr-1" style={{maxWidth: 25}}/>
                    <p>{e[1].san}</p>
                  </div>
              )
            }
          </div>
          )
        })
      }
    </div>
  );
}
