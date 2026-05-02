# Stage 1

## Approach: Maintaining Top 'n' Priority Notifications Efficiently

To efficiently maintain the top 'n' (e.g., 10) priority notifications from an incoming stream, a **Min-Heap (Priority Queue)** data structure is the optimal approach.

### Priority Rules
The priority of a notification is determined by two factors:
1. **Weight**: `Placement` (High) > `Result` (Medium) > `Event` (Low). We assign numeric weights: Placement = 3, Result = 2, Event = 1.
2. **Recency**: If two notifications have the same weight, the one with the more recent `Timestamp` has higher priority.

### Why a Min-Heap?
We need to keep track of the *top n* elements. 
A Min-Heap of size `n` keeps the *least* important notification among the top 'n' at its root. 

When a new notification arrives from the stream:
1. If the heap has less than `n` elements, we simply insert the new notification.
2. If the heap has `n` elements, we compare the new notification with the root of the heap (the nth most important notification).
   - If the new notification is *less* important or equal to the root, we discard it.
   - If the new notification is *more* important than the root, we remove the root (extract-min) and insert the new notification.

### Time & Space Complexity
- **Insertion**: Inserting a single element into a heap of size `n` takes `O(log n)` time.
- **Processing Stream**: Processing `m` incoming notifications takes `O(m log n)` time.
- **Space Complexity**: We only ever store `n` notifications in memory, resulting in `O(n)` space complexity.

This approach ensures that we don't need to store or re-sort the entire history of notifications, making it extremely memory-efficient and fast for real-time streams.
