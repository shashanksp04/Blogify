const CommentsList = ({comments}) => {
//     return (
//         <>
//             <h3>Comments:</h3>
//             {comments.map((post,info) => (
//                 <div className="comment" key={post + " : "+ info}>
//                     <h4>{post}</h4>
//                     <p>{info}</p>
//                 </div>
//             ))}
//         </>
//     )
// }
    //console.log(comments);
    return (
        <>
        <h3>Comments:</h3>
        {comments.map((comment, index) => (
            <div className="comment" key={index}>
                {Object.keys(comment).map((key, keyIndex) => {
                    const value = comment[key];
                    if (value.trim() !== "") { // Check if the value is not empty
                        return (
                            <div key={keyIndex}>
                                <h4>{key}</h4>
                                <p>{value}</p>
                            </div>
                        );
                    }
                    return null; // Skip rendering if value is empty
                })}
            </div>
        ))}
    </>
    )
}

export default CommentsList;